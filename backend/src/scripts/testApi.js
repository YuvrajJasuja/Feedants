const app = require('../app');
const { connectDB, disconnectDB } = require('../config/database');
const Competition = require('../models/Competition');
const User = require('../models/User');
const Participation = require('../models/Participation');
const Submission = require('../models/Submission');
const Review = require('../models/Review');
const http = require('http');

let server;
let baseUrl;

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${baseUrl}${path}`);
    const reqOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = http.request(url, reqOptions, (res) => {
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

    req.on('error', reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=============== STARTING STEP 5 COMPREHENSIVE TEST SUITE ===============\n');
  await connectDB();

  server = app.listen(0);
  const port = server.address().port;
  baseUrl = `http://localhost:${port}`;
  console.log(`[Test Runner] Test server listening on ${baseUrl}\n`);

  // Clear & Seed Test Database
  await Competition.deleteMany({});
  await User.deleteMany({});
  await Participation.deleteMany({});
  await Submission.deleteMany({});
  await Review.deleteMany({});

  const user1 = await User.create({ name: 'Test User 1', email: 'user1@test.com', passwordHash: 'p1' });
  const user2 = await User.create({ name: 'Test User 2', email: 'user2@test.com', passwordHash: 'p2' });
  const user3 = await User.create({ name: 'Test User 3', email: 'user3@test.com', passwordHash: 'p3' });
  const userUnregistered = await User.create({ name: 'Unregistered User', email: 'unreg@test.com', passwordHash: 'p4' });

  const now = new Date();
  const day = 24 * 60 * 60 * 1000;

  // Active Competition (Capacity 2)
  const activeComp = await Competition.create({
    title: 'Feedants Classical Dance',
    category: 'Dance',
    description: 'Active contest',
    prizePool: 1500,
    entryFee: 99,
    maxParticipants: 2, // Capacity = 2
    registeredParticipants: 0,
    registrationStart: new Date(now.getTime() - 5 * day),
    registrationEnd: new Date(now.getTime() + 10 * day),
    submissionStart: new Date(now.getTime() - 1 * day),
    submissionEnd: new Date(now.getTime() + 15 * day),
    resultDate: new Date(now.getTime() + 25 * day),
    status: 'REGISTRATION_OPEN',
    judge: { name: 'Manju Dubey', profession: 'Kathak Expert', experience: '12 years', image: 'https://example.com/j.jpg' },
    rewards: [{ position: '1st Winner', amount: 550 }],
    judgingParameters: 'Rhythm and Expression',
    rules: '1 to 3 min video',
    eligibility: 'Open to all',
  });

  // Closed Competition
  const closedComp = await Competition.create({
    title: 'Closed Contest',
    category: 'Music',
    description: 'Past registration deadline',
    prizePool: 1000,
    entryFee: 50,
    maxParticipants: 10,
    registeredParticipants: 0,
    registrationStart: new Date(now.getTime() - 20 * day),
    registrationEnd: new Date(now.getTime() - 2 * day), // Closed 2 days ago
    submissionStart: new Date(now.getTime() - 1 * day),
    submissionEnd: new Date(now.getTime() + 10 * day),
    resultDate: new Date(now.getTime() + 20 * day),
    status: 'REGISTRATION_CLOSED',
    judge: { name: 'Judge B', profession: 'Musician', experience: '10 yrs', image: 'https://example.com/j.jpg' },
    rewards: [{ position: '1st Winner', amount: 1000 }],
    judgingParameters: 'Sur & Taal',
    rules: 'Audio video',
    eligibility: 'Open to all',
  });

  let passCount = 0;
  let failCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(` ✅ PASS: ${message}`);
      passCount++;
    } else {
      console.error(` ❌ FAIL: ${message}`);
      failCount++;
    }
  }

  try {
    // 1. GET /api/health
    const health = await request('/api/health');
    assert(health.status === 200 && health.body.success === true, 'GET /api/health returns 200 OK');

    // 2. Open Competition & Verify Data
    const compRes = await request(`/api/competitions/${activeComp._id}`);
    assert(
      compRes.status === 200 &&
        compRes.body.data.remainingSpots === 2 &&
        compRes.body.data.isRegistrationActive === true,
      'GET /api/competitions/:id returns correct remaining spots (2) & registration active status'
    );

    // 3. Register User 1
    const reg1 = await request(`/api/competitions/${activeComp._id}/register`, {
      method: 'POST',
      body: { userId: user1._id },
    });
    assert(reg1.status === 201 && reg1.body.success === true, 'User 1 registers successfully');

    // 4. Verify participant count & remaining spots
    const compRes2 = await request(`/api/competitions/${activeComp._id}`);
    assert(
      compRes2.body.data.registeredParticipants === 1 && compRes2.body.data.remainingSpots === 1,
      'Remaining spots decremented dynamically to 1 (1/2 registered)'
    );

    // 5. Attempt Duplicate Registration (HTTP 409)
    const dupReg = await request(`/api/competitions/${activeComp._id}/register`, {
      method: 'POST',
      body: { userId: user1._id },
    });
    assert(
      dupReg.status === 409 && dupReg.body.error.code === 'ALREADY_REGISTERED',
      'Duplicate registration rejected with HTTP 409 ALREADY_REGISTERED'
    );

    // 6. Register User 2 (Fills capacity to 2/2)
    const reg2 = await request(`/api/competitions/${activeComp._id}/register`, {
      method: 'POST',
      body: { userId: user2._id },
    });
    assert(reg2.status === 201, 'User 2 registers successfully (capacity 2/2 reached)');

    // 7. Test Full Competition Rejection (HTTP 400 COMPETITION_FULL)
    const fullReg = await request(`/api/competitions/${activeComp._id}/register`, {
      method: 'POST',
      body: { userId: user3._id },
    });
    assert(
      fullReg.status === 400 && fullReg.body.error.code === 'COMPETITION_FULL',
      'Registration when competition is FULL rejected with HTTP 400 COMPETITION_FULL'
    );

    // 8. Test Closed Registration Rejection (HTTP 400 REGISTRATION_CLOSED)
    const closedReg = await request(`/api/competitions/${closedComp._id}/register`, {
      method: 'POST',
      body: { userId: user1._id },
    });
    assert(
      closedReg.status === 400 && closedReg.body.error.code === 'REGISTRATION_CLOSED',
      'Registration after deadline rejected with HTTP 400 REGISTRATION_CLOSED'
    );

    // 9. Test Submission by Registered User
    const subRes = await request(`/api/competitions/${activeComp._id}/submissions`, {
      method: 'POST',
      body: {
        userId: user1._id,
        title: 'Kathak Solo Performance',
        mediaUrl: 'https://example.com/dance.mp4',
      },
    });
    assert(subRes.status === 201 && subRes.body.data.status === 'UPLOADED', 'Registered user submits entry successfully');

    // 10. Test Duplicate Submission Rejection
    const dupSub = await request(`/api/competitions/${activeComp._id}/submissions`, {
      method: 'POST',
      body: {
        userId: user1._id,
        title: 'Duplicate Dance Attempt',
        mediaUrl: 'https://example.com/dance2.mp4',
      },
    });
    assert(
      dupSub.status === 400 && dupSub.body.error.code === 'ALREADY_SUBMITTED',
      'Duplicate submission rejected with HTTP 400 ALREADY_SUBMITTED'
    );

    // 11. Test Unregistered User Submission Rejection
    const unregSub = await request(`/api/competitions/${activeComp._id}/submissions`, {
      method: 'POST',
      body: {
        userId: userUnregistered._id,
        title: 'Unregistered Video',
        mediaUrl: 'https://example.com/video.mp4',
      },
    });
    assert(
      unregSub.status === 403 && unregSub.body.error.code === 'NOT_REGISTERED',
      'Unregistered user submission rejected with HTTP 403 NOT_REGISTERED'
    );

    // 12. Test Non-existent Competition 404
    const notFoundRes = await request('/api/competitions/6ab250f749f7e9e5f758f000');
    assert(notFoundRes.status === 404, 'Non-existent competition returns HTTP 404 NOT_FOUND');

    // 13. Verify Participation State API
    const partStatus = await request(`/api/competitions/${activeComp._id}/participation?userId=${user1._id}`);
    assert(
      partStatus.status === 200 && partStatus.body.data.isRegistered === true,
      'Participation status returns registered state for User 1'
    );

    console.log('\n=======================================================');
    console.log(`STEP 5 TEST SUITE SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
    console.log('=======================================================\n');
  } catch (err) {
    console.error('[Test Error]:', err);
  } finally {
    server.close();
    await disconnectDB();
    process.exit(failCount > 0 ? 1 : 0);
  }
}

runTests();
