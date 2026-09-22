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
  console.log('=============== STARTING API TEST SUITE ===============\n');
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

  const user1 = await User.create({
    name: 'Test User One',
    email: 'user1@test.com',
    passwordHash: 'pass123',
  });
  const user2 = await User.create({
    name: 'Test User Two',
    email: 'user2@test.com',
    passwordHash: 'pass123',
  });

  const now = new Date();
  const activeComp = await Competition.create({
    title: 'Feedants Classical Dance',
    category: 'Dance',
    description: 'Classical Indian dance contest.',
    prizePool: 1500,
    entryFee: 99,
    maxParticipants: 3, // Set capacity to 3 for fast full testing
    registeredParticipants: 0,
    registrationStart: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    registrationEnd: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 10), // 10 days in future
    submissionStart: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1), // Submission active
    submissionEnd: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 15),
    resultDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 25),
    status: 'REGISTRATION_OPEN',
    judge: {
      name: 'Manju Dubey',
      profession: 'Kathak Expert',
      experience: '12 years',
      image: 'https://example.com/avatar.jpg',
    },
    rewards: [{ position: '1st Winner', amount: 550 }],
    judgingParameters: 'Rhythm and Expression',
    rules: '1 to 3 min video',
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
    // TEST 1: Health Endpoint
    const healthRes = await request('/api/health');
    assert(healthRes.status === 200 && healthRes.body.success === true, 'GET /api/health returns 200 OK');

    // TEST 2: Get All Competitions
    const listRes = await request('/api/competitions');
    assert(listRes.status === 200 && listRes.body.data.length === 1, 'GET /api/competitions returns list');

    // TEST 3: Get Competition Details with computed state
    const detailRes = await request(`/api/competitions/${activeComp._id}`);
    assert(
      detailRes.status === 200 &&
        detailRes.body.data.remainingSpots === 3 &&
        detailRes.body.data.isRegistrationActive === true,
      'GET /api/competitions/:id returns correct remaining spots (3) and active registration status'
    );

    // TEST 4: Successful Registration
    const regRes1 = await request(`/api/competitions/${activeComp._id}/register`, {
      method: 'POST',
      body: { userId: user1._id },
    });
    assert(
      regRes1.status === 201 && regRes1.body.success === true,
      'POST /api/competitions/:id/register registers User 1 successfully'
    );

    // TEST 5: Verify remaining spots updated dynamically to 2
    const detailRes2 = await request(`/api/competitions/${activeComp._id}`);
    assert(
      detailRes2.body.data.remainingSpots === 2 && detailRes2.body.data.registeredParticipants === 1,
      'Remaining spots dynamically decremented from 3 to 2 after registration'
    );

    // TEST 6: Duplicate Registration Rejection
    const dupRes = await request(`/api/competitions/${activeComp._id}/register`, {
      method: 'POST',
      body: { userId: user1._id },
    });
    assert(
      dupRes.status === 400 && dupRes.body.error.code === 'ALREADY_REGISTERED',
      'Duplicate registration rejected with HTTP 400 ALREADY_REGISTERED'
    );

    // TEST 7: Invalid Registration (Missing userId)
    const invalidRegRes = await request(`/api/competitions/${activeComp._id}/register`, {
      method: 'POST',
      body: {},
    });
    assert(
      invalidRegRes.status === 400 && invalidRegRes.body.error.code === 'VALIDATION_ERROR',
      'Missing userId registration rejected with HTTP 400 VALIDATION_ERROR'
    );

    // TEST 8: Check Participation Status
    const partRes = await request(`/api/competitions/${activeComp._id}/participation?userId=${user1._id}`);
    assert(
      partRes.status === 200 && partRes.body.data.isRegistered === true,
      'GET /api/competitions/:id/participation returns status REGISTERED for User 1'
    );

    // TEST 9: Submit Performance Entry
    const subRes = await request(`/api/competitions/${activeComp._id}/submissions`, {
      method: 'POST',
      body: {
        userId: user1._id,
        title: 'Kathak Teen Taal Tarana',
        description: 'Classical kathak solo performance.',
        mediaUrl: 'https://example.com/video.mp4',
      },
    });
    assert(
      subRes.status === 201 && subRes.body.data.status === 'UPLOADED',
      'POST /api/competitions/:id/submissions submits video entry successfully'
    );

    // TEST 10: Reviews API
    const revPost = await request(`/api/competitions/${activeComp._id}/reviews`, {
      method: 'POST',
      body: {
        userId: user1._id,
        rating: 5,
        comment: 'Amazing classical dance platform!',
      },
    });
    assert(revPost.status === 201, 'POST /api/competitions/:id/reviews submits review');

    const revGet = await request(`/api/competitions/${activeComp._id}/reviews`);
    assert(revGet.status === 200 && revGet.body.data.length === 1, 'GET /api/competitions/:id/reviews returns reviews');

    // TEST 11: Fill Competition & Test Capacity Cap
    const user3 = await User.create({ name: 'User 3', email: 'user3@test.com', passwordHash: 'p' });
    const user4 = await User.create({ name: 'User 4', email: 'user4@test.com', passwordHash: 'p' });

    await request(`/api/competitions/${activeComp._id}/register`, { method: 'POST', body: { userId: user2._id } });
    await request(`/api/competitions/${activeComp._id}/register`, { method: 'POST', body: { userId: user3._id } });

    // Capacity is now 3/3
    const fullRegRes = await request(`/api/competitions/${activeComp._id}/register`, {
      method: 'POST',
      body: { userId: user4._id },
    });
    assert(
      fullRegRes.status === 400 && fullRegRes.body.error.code === 'COMPETITION_FULL',
      'Registration when competition is FULL rejected with HTTP 400 COMPETITION_FULL'
    );

    console.log('\n=======================================================');
    console.log(`TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
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
