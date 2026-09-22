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
    console.error(`❌ TEST FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`✅ TEST PASSED: ${message}`);
  }
}

async function runStep9Tests() {
  console.log('\n=== STARTING STEP 9 COMPETITION DETAILS & REVIEWS API TESTS ===\n');

  try {
    // 1. Fetch Competition List & pick active competition
    const compListRes = await makeRequest({
      hostname: BASE_HOST,
      port: PORT,
      path: '/api/competitions',
      method: 'GET',
    });
    assert(compListRes.status === 200 && compListRes.body.data.length > 0, 'Fetched active competitions from backend');

    const targetComp = compListRes.body.data[0];
    const compId = targetComp.id || targetComp._id;

    // 2. Fetch Single Competition Details and check dynamic fields
    const detailsRes = await makeRequest({
      hostname: BASE_HOST,
      port: PORT,
      path: `/api/competitions/${compId}`,
      method: 'GET',
    });
    assert(detailsRes.status === 200 && detailsRes.body.data, 'Fetched competition details object');
    const comp = detailsRes.body.data;

    assert(Boolean(comp.title), 'Competition title is present dynamically');
    assert(Boolean(comp.description), 'Competition description is present dynamically');
    assert(Boolean(comp.judge?.name), 'Judge information is present dynamically');
    assert(Boolean(comp.rules), 'Rules are present dynamically');
    assert(Boolean(comp.judgingParameters), 'Judging parameters are present dynamically');
    assert(Boolean(comp.eligibility), 'Eligibility information is present dynamically');
    assert(Array.isArray(comp.rewards), 'Rewards tier list is present dynamically');

    // 3. Register a Test User for authentication
    const userEmail = `rev_user_${Date.now()}@example.com`;
    const regRes = await makeRequest(
      {
        hostname: BASE_HOST,
        port: PORT,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Reviewer User',
        email: userEmail,
        password: 'Password123!',
      }
    );
    assert(regRes.status === 201 && regRes.body.data.token, 'Registered test user for review tests');
    const userToken = regRes.body.data.token;

    // 4. Test Unauthenticated Review Rejection (HTTP 401)
    const unauthRev = await makeRequest(
      {
        hostname: BASE_HOST,
        port: PORT,
        path: `/api/competitions/${compId}/reviews`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { rating: 5, comment: 'Great event!' }
    );
    assert(unauthRev.status === 401, 'Unauthenticated review attempt rejected with 401 Unauthorized');

    // 5. Test Invalid Rating Validation (<1 or >5) (HTTP 400)
    const invalidRatingRev = await makeRequest(
      {
        hostname: BASE_HOST,
        port: PORT,
        path: `/api/competitions/${compId}/reviews`,
        method: 'POST',
        headers: { Authorization: `Bearer ${userToken}`, 'Content-Type': 'application/json' },
      },
      { rating: 6, comment: 'Invalid star rating test' }
    );
    assert(invalidRatingRev.status === 400, 'Invalid rating (>5) rejected with 400 Validation Error');

    // 6. Test Valid Review Submission for Test User
    const validRev = await makeRequest(
      {
        hostname: BASE_HOST,
        port: PORT,
        path: `/api/competitions/${compId}/reviews`,
        method: 'POST',
        headers: { Authorization: `Bearer ${userToken}`, 'Content-Type': 'application/json' },
      },
      { rating: 5, comment: 'Exceptional organization, beautiful theme and transparent judging criteria!' }
    );
    assert(validRev.status === 201 && validRev.body.success, 'Valid review created successfully in MongoDB');

    // 7. Test Duplicate Review Protection for Same User (HTTP 409)
    const dupRev = await makeRequest(
      {
        hostname: BASE_HOST,
        port: PORT,
        path: `/api/competitions/${compId}/reviews`,
        method: 'POST',
        headers: { Authorization: `Bearer ${userToken}`, 'Content-Type': 'application/json' },
      },
      { rating: 4, comment: 'Attempting second review' }
    );
    assert(
      dupRev.status === 409 && dupRev.body.error?.code === 'DUPLICATE_REVIEW',
      'Duplicate review attempt rejected with HTTP 409 DUPLICATE_REVIEW'
    );

    // 8. Test GET Reviews Endpoint returns list & stats (averageRating and totalReviews)
    const getRevs = await makeRequest({
      hostname: BASE_HOST,
      port: PORT,
      path: `/api/competitions/${compId}/reviews`,
      method: 'GET',
    });
    assert(
      getRevs.status === 200 &&
        Array.isArray(getRevs.body.data) &&
        typeof getRevs.body.stats?.averageRating === 'number' &&
        getRevs.body.stats?.totalReviews >= 1,
      'GET /api/competitions/:id/reviews returns reviews list and stats (averageRating & totalReviews)'
    );

    console.log('\n=== STEP 9 ALL COMPETITION DETAILS & REVIEWS TESTS PASSED SUCCESSFULLY! ===\n');
  } catch (err) {
    console.error('\n❌ STEP 9 TEST SUITE FAILED:', err.message);
    process.exit(1);
  }
}

runStep9Tests();
