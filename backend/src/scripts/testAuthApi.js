const http = require('http');

const PORT = 5000;
const BASE_HOST = '127.0.0.1';

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const json = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, headers: res.headers, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function runAuthTests() {
  console.log('=== STARTING STEP 7 AUTHENTICATION & MULTI-USER ISOLATION TESTS ===\n');
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ TEST ${total} PASSED: ${message}`);
      passed++;
    } else {
      console.error(`❌ TEST ${total} FAILED: ${message}`);
    }
  }

  try {
    // 0. Fetch Competition List
    const compRes = await makeRequest({
      hostname: BASE_HOST,
      port: PORT,
      path: '/api/competitions',
      method: 'GET',
    });
    const compId = compRes.body.data[0]._id || compRes.body.data[0].id;
    assert(compRes.status === 200 && compId, 'Fetched active competition list from backend');

    // 1. Register User A
    const userAEmail = `test.user.a.${Date.now()}@example.com`;
    const regResA = await makeRequest(
      {
        hostname: BASE_HOST,
        port: PORT,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { name: 'User Alpha', email: userAEmail, password: 'password123' }
    );

    assert(
      regResA.status === 201 && regResA.body.success && regResA.body.data.token,
      'User A registered successfully and received JWT token'
    );
    assert(!regResA.body.data.user.passwordHash, 'User A response does NOT expose passwordHash');

    const tokenA = regResA.body.data.token;
    const userAId = regResA.body.data.user.id;

    // 2. Duplicate Registration Rejection
    const dupRes = await makeRequest(
      {
        hostname: BASE_HOST,
        port: PORT,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { name: 'User Alpha Copy', email: userAEmail, password: 'password123' }
    );
    assert(dupRes.status === 409 && !dupRes.body.success, 'Duplicate email registration rejected with 409 Conflict');

    // 3. Login User A (Correct Password)
    const loginResA = await makeRequest(
      {
        hostname: BASE_HOST,
        port: PORT,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: userAEmail, password: 'password123' }
    );
    assert(
      loginResA.status === 200 && loginResA.body.success && loginResA.body.data.token,
      'User A logged in with correct credentials and received JWT token'
    );

    // 4. Login User A (Wrong Password)
    const loginFailRes = await makeRequest(
      {
        hostname: BASE_HOST,
        port: PORT,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: userAEmail, password: 'wrongpassword' }
    );
    assert(loginFailRes.status === 401 && !loginFailRes.body.success, 'Wrong password rejected with 401 Unauthorized');

    // 5. GET /api/auth/me (Authenticated)
    const meResA = await makeRequest({
      hostname: BASE_HOST,
      port: PORT,
      path: '/api/auth/me',
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(
      meResA.status === 200 && meResA.body.data.user.email === userAEmail,
      'GET /api/auth/me returned authenticated User A profile'
    );

    // 6. Register User B
    const userBEmail = `test.user.b.${Date.now()}@example.com`;
    const regResB = await makeRequest(
      {
        hostname: BASE_HOST,
        port: PORT,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { name: 'User Beta', email: userBEmail, password: 'password456' }
    );
    assert(regResB.status === 201 && regResB.body.data.token, 'User B registered successfully');

    const tokenB = regResB.body.data.token;

    // 7. User A registers for Competition
    const regCompResA = await makeRequest(
      {
        hostname: BASE_HOST,
        port: PORT,
        path: `/api/competitions/${compId}/register`,
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenA}`, 'Content-Type': 'application/json' },
      },
      {}
    );
    assert(regCompResA.status === 201 && regCompResA.body.success, 'User A registered for competition');

    // 8. User B checks participation status for Competition (Participation Isolation Test)
    const partResB = await makeRequest({
      hostname: BASE_HOST,
      port: PORT,
      path: `/api/competitions/${compId}/participation`,
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    assert(
      partResB.status === 200 && partResB.body.data.isRegistered === false,
      'User B does NOT see User A registration state (State isolation verified)'
    );

    // 9. User B registers for Competition
    const regCompResB = await makeRequest(
      {
        hostname: BASE_HOST,
        port: PORT,
        path: `/api/competitions/${compId}/register`,
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenB}`, 'Content-Type': 'application/json' },
      },
      {}
    );
    assert(regCompResB.status === 201 && regCompResB.body.success, 'User B registered for competition independently');

    // 10. GET /api/me/competitions for User A
    const myCompResA = await makeRequest({
      hostname: BASE_HOST,
      port: PORT,
      path: '/api/me/competitions',
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(
      myCompResA.status === 200 && myCompResA.body.data.length > 0,
      'GET /api/me/competitions returned registered contests for User A'
    );

    // 11. Unauthenticated / Invalid Token Rejection
    const invalidTokenRes = await makeRequest({
      hostname: BASE_HOST,
      port: PORT,
      path: `/api/competitions/${compId}/register`,
      method: 'POST',
      headers: { Authorization: 'Bearer invalid_garbage_token_999' },
    });
    assert(
      invalidTokenRes.status === 401 && !invalidTokenRes.body.success,
      'Invalid token rejected with 401 Unauthorized'
    );

    console.log(`\n=== STEP 7 BACKEND AUTH TEST RESULTS: ${passed}/${total} PASSED ===`);
  } catch (err) {
    console.error('Test script error:', err);
  }
}

runAuthTests();
