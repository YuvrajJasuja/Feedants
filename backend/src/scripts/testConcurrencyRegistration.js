const http = require('http');

const PORT = process.env.PORT || 5000;
const BASE_HOST = '127.0.0.1';

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(typeof postData === 'object' ? JSON.stringify(postData) : postData);
    }
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ CONCURRENCY TEST FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`✅ TEST PASSED: ${message}`);
  }
}

async function runConcurrencyTest() {
  console.log('\n=== STARTING STEP 10 ATOMIC CONCURRENCY REGISTRATION TEST ===\n');

  try {
    // 1. Fetch available competitions from backend
    const compListRes = await makeRequest({
      hostname: BASE_HOST,
      port: PORT,
      path: '/api/competitions',
      method: 'GET',
    });
    assert(compListRes.status === 200 && compListRes.body.data.length > 0, 'Fetched competition list from backend');

    // Pick competition B (which is capped at 5 spots or active registration comp)
    let targetComp = compListRes.body.data.find((c) => c.maxParticipants === 5) || compListRes.body.data[0];
    const compId = targetComp.id || targetComp._id;

    console.log(`[Test Target]: Competition '${targetComp.title}' (ID: ${compId})`);
    console.log(`[Capacity limit]: Max participants = ${targetComp.maxParticipants}`);

    // 2. Register 20 independent test users concurrently
    const NUM_USERS = 20;
    console.log(`\n[Action]: Registering ${NUM_USERS} independent test users concurrently...`);
    const users = [];

    for (let i = 1; i <= NUM_USERS; i++) {
      const email = `conc_user_${Date.now()}_${i}_${Math.floor(Math.random() * 10000)}@test.com`;
      const regUserRes = await makeRequest(
        {
          hostname: BASE_HOST,
          port: PORT,
          path: '/api/auth/register',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        {
          name: `Concurrent User ${i}`,
          email,
          password: 'Password123!',
        }
      );
      if (regUserRes.status === 201 && regUserRes.body.data?.token) {
        users.push({ id: regUserRes.body.data.user.id, token: regUserRes.body.data.token });
      }
    }

    assert(users.length === NUM_USERS, `Created ${NUM_USERS} test users with valid JWT tokens`);

    // 3. Fire 20 registration requests SIMULTANEOUSLY using Promise.all()
    console.log(`\n⚡ Firing ${NUM_USERS} concurrent POST /api/competitions/${compId}/register requests...`);
    const registrationPromises = users.map((u) =>
      makeRequest({
        hostname: BASE_HOST,
        port: PORT,
        path: `/api/competitions/${compId}/register`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${u.token}`,
          'Content-Type': 'application/json',
        },
      })
    );

    const results = await Promise.all(registrationPromises);

    // 4. Analyze results
    const successfulAttempts = results.filter((r) => r.status === 200 || r.status === 201);
    const rejectedAttempts = results.filter((r) => r.status === 400 || r.status === 409);

    console.log(`\n=== CONCURRENCY REGISTRATION RESULTS ===`);
    console.log(`- Total Requests Fired: ${results.length}`);
    console.log(`- Successful Registrations: ${successfulAttempts.length}`);
    console.log(`- Rejected (Full/Conflict): ${rejectedAttempts.length}`);

    // 5. Authoritative backend check
    const finalCompRes = await makeRequest({
      hostname: BASE_HOST,
      port: PORT,
      path: `/api/competitions/${compId}`,
      method: 'GET',
    });
    const finalComp = finalCompRes.body.data;

    console.log(`- Final Registered Participants in DB: ${finalComp.registeredParticipants}`);
    console.log(`- Final Remaining Spots in DB: ${finalComp.remainingSpots}`);

    // VERIFICATIONS
    assert(
      finalComp.registeredParticipants <= finalComp.maxParticipants,
      `Registered participants (${finalComp.registeredParticipants}) NEVER exceeded max capacity (${finalComp.maxParticipants})`
    );

    assert(
      finalComp.remainingSpots >= 0,
      `Remaining spots (${finalComp.remainingSpots}) is NEVER negative`
    );

    assert(
      successfulAttempts.length <= finalComp.maxParticipants,
      `Successful HTTP responses (${successfulAttempts.length}) did not exceed capacity (${finalComp.maxParticipants})`
    );

    assert(
      successfulAttempts.length + rejectedAttempts.length === NUM_USERS,
      `All ${NUM_USERS} requests received explicit success or conflict status codes`
    );

    console.log('\n=== STEP 10 ATOMIC CONCURRENCY TEST PASSED 100%! ===\n');
  } catch (err) {
    console.error('\n❌ CONCURRENCY TEST SUITE FAILED:', err.message);
    process.exit(1);
  }
}

runConcurrencyTest();
