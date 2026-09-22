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

async function runSubmissionFlowTests() {
  console.log('=== STARTING STEP 8 SUBMISSION WORKFLOW & VALIDATION TESTS ===\n');
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
    // 1. Fetch Competitions
    const compRes = await makeRequest({
      hostname: BASE_HOST,
      port: PORT,
      path: '/api/competitions',
      method: 'GET',
    });
    const compId = compRes.body.data[0]._id || compRes.body.data[0].id;
    assert(compRes.status === 200 && compId, 'Fetched active competition from backend');

    // 2. Register Test User 1 & Test User 2
    const email1 = `sub.user.1.${Date.now()}@example.com`;
    const email2 = `sub.user.2.${Date.now()}@example.com`;

    const reg1 = await makeRequest(
      { hostname: BASE_HOST, port: PORT, path: '/api/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { name: 'Submittor One', email: email1, password: 'password123' }
    );
    const token1 = reg1.body.data.token;

    const reg2 = await makeRequest(
      { hostname: BASE_HOST, port: PORT, path: '/api/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { name: 'Submittor Two', email: email2, password: 'password123' }
    );
    const token2 = reg2.body.data.token;

    assert(token1 && token2, 'Registered two independent test users with JWT tokens');

    // 3. Try submitting before registering (Unregistered User Protection)
    const unregSub = await makeRequest(
      {
        hostname: BASE_HOST,
        port: PORT,
        path: `/api/competitions/${compId}/submissions`,
        method: 'POST',
        headers: { Authorization: `Bearer ${token1}`, 'Content-Type': 'application/json' },
      },
      { title: 'Classical Dance Entry', videoUrl: 'https://example.com/video1.mp4' }
    );
    assert(
      unregSub.status === 403 && unregSub.body.error?.code === 'NOT_REGISTERED',
      'Unregistered submission attempt rejected with 403 NOT_REGISTERED'
    );

    // 4. User 1 registers for Competition
    const regComp1 = await makeRequest(
      {
        hostname: BASE_HOST,
        port: PORT,
        path: `/api/competitions/${compId}/register`,
        method: 'POST',
        headers: { Authorization: `Bearer ${token1}`, 'Content-Type': 'application/json' },
      },
      {}
    );
    assert(regComp1.status === 201 && regComp1.body.success, 'User 1 registered for competition');

    // 5. Submit without media URL (Invalid Submission Protection)
    const noMediaSub = await makeRequest(
      {
        hostname: BASE_HOST,
        port: PORT,
        path: `/api/competitions/${compId}/submissions`,
        method: 'POST',
        headers: { Authorization: `Bearer ${token1}`, 'Content-Type': 'application/json' },
      },
      { title: 'Test Entry', videoUrl: '' }
    );
    assert(
      noMediaSub.status === 400 && !noMediaSub.body.success,
      'Submission missing media URL rejected with 400 Validation Error'
    );

    // 6. Submit without title (Invalid Submission Protection)
    const noTitleSub = await makeRequest(
      {
        hostname: BASE_HOST,
        port: PORT,
        path: `/api/competitions/${compId}/submissions`,
        method: 'POST',
        headers: { Authorization: `Bearer ${token1}`, 'Content-Type': 'application/json' },
      },
      { title: '', videoUrl: 'https://example.com/video1.mp4' }
    );
    assert(
      noTitleSub.status === 400 && !noTitleSub.body.success,
      'Submission missing title rejected with 400 Validation Error'
    );

    // 7. Valid Submission Creation for User 1
    const validSub1 = await makeRequest(
      {
        hostname: BASE_HOST,
        port: PORT,
        path: `/api/competitions/${compId}/submissions`,
        method: 'POST',
        headers: { Authorization: `Bearer ${token1}`, 'Content-Type': 'application/json' },
      },
      {
        title: 'Classical Kathak Solo Performance',
        description: 'Choreographed in Teen Taal with authentic costume and rhythm.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      }
    );
    assert(
      validSub1.status === 201 && validSub1.body.success && validSub1.body.data.status === 'UNDER_REVIEW',
      'User 1 performance submission created in MongoDB with status UNDER_REVIEW'
    );

    // 8. Duplicate Submission Protection for User 1 (HTTP 409 Requirement 13)
    const dupSub1 = await makeRequest(
      {
        hostname: BASE_HOST,
        port: PORT,
        path: `/api/competitions/${compId}/submissions`,
        method: 'POST',
        headers: { Authorization: `Bearer ${token1}`, 'Content-Type': 'application/json' },
      },
      {
        title: 'Duplicate Attempt',
        videoUrl: 'https://example.com/video_dup.mp4',
      }
    );
    assert(
      dupSub1.status === 409 && dupSub1.body.error?.code === 'ALREADY_SUBMITTED',
      'Duplicate submission attempt rejected with HTTP 409 ALREADY_SUBMITTED'
    );

    // 9. Check Participation Status for User 1
    const partStatus1 = await makeRequest({
      hostname: BASE_HOST,
      port: PORT,
      path: `/api/competitions/${compId}/participation`,
      method: 'GET',
      headers: { Authorization: `Bearer ${token1}` },
    });
    assert(
      partStatus1.status === 200 &&
        partStatus1.body.data.status === 'UNDER_REVIEW' &&
        partStatus1.body.data.hasSubmitted === true,
      'User 1 participation state updated to UNDER_REVIEW and hasSubmitted = true'
    );

    // 10. User 2 registers and checks submission isolation
    await makeRequest(
      {
        hostname: BASE_HOST,
        port: PORT,
        path: `/api/competitions/${compId}/register`,
        method: 'POST',
        headers: { Authorization: `Bearer ${token2}`, 'Content-Type': 'application/json' },
      },
      {}
    );

    const subStatus2 = await makeRequest({
      hostname: BASE_HOST,
      port: PORT,
      path: `/api/competitions/${compId}/submissions`,
      method: 'GET',
      headers: { Authorization: `Bearer ${token2}` },
    });
    assert(
      subStatus2.status === 200 && subStatus2.body.data === null,
      'User 2 sees null submission prior to uploading (Submission isolation verified)'
    );

    // 11. Valid Submission Creation for User 2
    const validSub2 = await makeRequest(
      {
        hostname: BASE_HOST,
        port: PORT,
        path: `/api/competitions/${compId}/submissions`,
        method: 'POST',
        headers: { Authorization: `Bearer ${token2}`, 'Content-Type': 'application/json' },
      },
      {
        title: 'Bharatanatyam Alarippu Showcase',
        description: 'Pure nritta dance in Ekam Taala.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      }
    );
    assert(
      validSub2.status === 201 && validSub2.body.success,
      'User 2 created performance submission independently'
    );

    // 12. Verify GET /api/me/competitions returns updated submission status for User 1
    const myComps1 = await makeRequest({
      hostname: BASE_HOST,
      port: PORT,
      path: '/api/me/competitions',
      method: 'GET',
      headers: { Authorization: `Bearer ${token1}` },
    });
    assert(
      myComps1.status === 200 &&
        myComps1.body.data[0].participation.hasSubmitted === true &&
        myComps1.body.data[0].participation.status === 'UNDER_REVIEW',
      'GET /api/me/competitions reflects UNDER_REVIEW status for current user'
    );

    // 13. Test Unauthenticated / Invalid Token Rejection
    const unauthSub = await makeRequest(
      {
        hostname: BASE_HOST,
        port: PORT,
        path: `/api/competitions/${compId}/submissions`,
        method: 'POST',
        headers: { Authorization: 'Bearer invalid_token_123', 'Content-Type': 'application/json' },
      },
      { title: 'Hack Attempt', videoUrl: 'https://example.com/hack.mp4' }
    );
    assert(unauthSub.status === 401 && !unauthSub.body.success, 'Invalid JWT token rejected with 401 Unauthorized');

    console.log(`\n=== STEP 8 SUBMISSION WORKFLOW TEST RESULTS: ${passed}/${total} PASSED ===`);
  } catch (err) {
    console.error('Test script error:', err);
  }
}

runSubmissionFlowTests();
