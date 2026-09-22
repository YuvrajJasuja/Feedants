const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/database');
const Competition = require('../models/Competition');
const User = require('../models/User');
const Participation = require('../models/Participation');
const Review = require('../models/Review');

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await Competition.deleteMany({});
    await User.deleteMany({});
    await Participation.deleteMany({});
    await Review.deleteMany({});

    // 1. Create Default Demo Users
    const demoUser = await User.create({
      name: 'Rohan Sharma',
      email: 'rohan.sharma@example.com',
      passwordHash: 'hashed_password_secure_123',
      profileImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvuG3miwQBhKj1zIdyGpkitYoDWw-jDJnPBZcXk-vZi_Bns7AyobGEcQJxqjQdGnijg6YjDcxUgJcY_nRptIfBPw5LkYCtQU7739LsYkv62DbD_zqNaWlJ2FAgi3LUbPlOmV5HILmjeR62YyNqEIT4Dy0YJxIiHQipFAqEObublXLa17u7bE4KJEiP0ykAatvAuDczQSTTGzhWHb6i8pVVY9ghOh5XUINe-1nXLfxOKXh3epGaTANR89_yShR_UjIXTM0',
    });

    const now = new Date();
    const day = 24 * 60 * 60 * 1000;

    // --- Scenario A: REGISTRATION_OPEN ---
    const compA = await Competition.create({
      title: 'Feedants Classical Dance',
      category: 'Dance',
      description: 'Showcase your talent, celebrate tradition, and let your passion dance its way to glory! This is an online classical dance competition open to all age groups.',
      prizePool: 1500,
      entryFee: 99,
      maxParticipants: 20,
      registeredParticipants: 1, // 19 spots left
      registrationStart: new Date(now.getTime() - 5 * day),
      registrationEnd: new Date(now.getTime() + 10 * day),
      submissionStart: new Date(now.getTime() + 5 * day),
      submissionEnd: new Date(now.getTime() + 15 * day),
      resultDate: new Date(now.getTime() + 25 * day),
      status: 'REGISTRATION_OPEN',
      judge: {
        name: 'Manju Dubey',
        profession: 'Professional Kathak Dancer',
        experience: '12+ years of experience',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFNqHvMzh8Ui713VpHW6BZzYr04_AlGdM_I85e5SBNFnvDP11T82QPxOCrRHNkR6SsFMzLUn2UW64jKR2C1iPk3xHMDtxBXujSb9OxMwlqKpOBs9xF0SwmAW9m7Bg-esLna4oUfsXltfrxTRTWJsz71PF7miTHgPpq0Iv3s0pTHgZ7JidB5W3EaRRgatw_goZNwPKNCJo00VoyeA228pJryCzWi13v1qZXveE933S5uWP35lHJFo0hF8HGFPKvu6UpNOs',
      },
      rewards: [
        { position: '1st Winner', amount: 550, label: 'Grand Prize' },
        { position: '2nd Winner', amount: 300, label: 'Runner Up' },
        { position: '3rd Winner', amount: 240, label: '2nd Runner Up' },
      ],
      previousWinners: [
        {
          name: 'Riya Sinha',
          position: '1st Winner',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAB66rxu0vws07TYIJZ2AuM0mt_0-zwUAHTslgCQL_zDManjIqltPtx51tFgClz3h1Z1ZzFfnHgF0g87_3Ci3qJV_f9iMbRjiTbg2jlur0ACQoOZQ-DMKT-x7NUlERhJoVknheSOmNH_l1Dwg05t52_nGTBrRiVW8BPps7jzaaeAVU_skd23FaSeihP6BjgG_xeUzmtANLO_oO6fKBDzXR6uC8tlL1Ui5_r_sdXUn9ot1fuCaXKo5mesU5bwtLcmLfdYe4',
          prizeAmount: '₹ 550',
        },
        {
          name: 'Ananya Roy',
          position: '2nd Winner',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvuG3miwQBhKj1zIdyGpkitYoDWw-jDJnPBZcXk-vZi_Bns7AyobGEcQJxqjQdGnijg6YjDcxUgJcY_nRptIfBPw5LkYCtQU7739LsYkv62DbD_zqNaWlJ2FAgi3LUbPlOmV5HILmjeR62YyNqEIT4Dy0YJxIiHQipFAqEObublXLa17u7bE4KJEiP0ykAatvAuDczQSTTGzhWHb6i8pVVY9ghOh5XUINe-1nXLfxOKXh3epGaTANR89_yShR_UjIXTM0',
          prizeAmount: '₹ 300',
        },
      ],
      judgingParameters: 'Rhythm & Tempo (Taal), Expressions (Abhinaya), Choreography, Costume & Authenticity.',
      rules: '1 to 3 min classical dance video.',
      eligibility: 'Open to all age groups across India.',
    });

    // Seed Sample Reviews for Comp A
    await Review.create({
      userId: demoUser._id,
      competitionId: compA._id,
      rating: 5,
      comment: 'Fantastic organization and clear judging guidelines! Very encouraging platform for classical dancers.',
    });

    // --- Scenario B: REGISTRATION_FULL ---
    const compB = await Competition.create({
      title: 'Royal Hindustani Sangeet',
      category: 'Music',
      description: 'Intimate classical vocal music showcase for top virtuosos.',
      prizePool: 3000,
      entryFee: 250,
      maxParticipants: 5,
      registeredParticipants: 5, // FULL!
      registrationStart: new Date(now.getTime() - 10 * day),
      registrationEnd: new Date(now.getTime() + 5 * day),
      submissionStart: new Date(now.getTime() + 2 * day),
      submissionEnd: new Date(now.getTime() + 12 * day),
      resultDate: new Date(now.getTime() + 20 * day),
      status: 'REGISTRATION_CLOSED',
      judge: {
        name: 'Pandit Ravi Sen',
        profession: 'Hindustani Vocal Maestro',
        experience: '30+ years',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFNqHvMzh8Ui713VpHW6BZzYr04_AlGdM_I85e5SBNFnvDP11T82QPxOCrRHNkR6SsFMzLUn2UW64jKR2C1iPk3xHMDtxBXujSb9OxMwlqKpOBs9xF0SwmAW9m7Bg-esLna4oUfsXltfrxTRTWJsz71PF7miTHgPpq0Iv3s0pTHgZ7JidB5W3EaRRgatw_goZNwPKNCJo00VoyeA228pJryCzWi13v1qZXveE933S5uWP35lHJFo0hF8HGFPKvu6UpNOs',
      },
      rewards: [{ position: '1st Winner', amount: 3000 }],
      judgingParameters: 'Sur, Taal, Alankar, and Raag purity.',
      rules: '3-minute audio/video rendition.',
      eligibility: 'Intermediate and advanced vocalists.',
    });

    // --- Scenario C: REGISTRATION_CLOSED (Deadline passed) ---
    const compC = await Competition.create({
      title: 'Bharatanatyam Heritage Trophy',
      category: 'Dance',
      description: 'Heritage series celebrating classical Bharatanatyam mudras and adavus.',
      prizePool: 2000,
      entryFee: 150,
      maxParticipants: 50,
      registeredParticipants: 12,
      registrationStart: new Date(now.getTime() - 20 * day),
      registrationEnd: new Date(now.getTime() - 2 * day), // Closed 2 days ago!
      submissionStart: new Date(now.getTime() - 1 * day),
      submissionEnd: new Date(now.getTime() + 10 * day),
      resultDate: new Date(now.getTime() + 18 * day),
      status: 'REGISTRATION_CLOSED',
      judge: {
        name: 'Dr. Ananya Natarajan',
        profession: 'Bharatanatyam Guru',
        experience: '25 years',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFNqHvMzh8Ui713VpHW6BZzYr04_AlGdM_I85e5SBNFnvDP11T82QPxOCrRHNkR6SsFMzLUn2UW64jKR2C1iPk3xHMDtxBXujSb9OxMwlqKpOBs9xF0SwmAW9m7Bg-esLna4oUfsXltfrxTRTWJsz71PF7miTHgPpq0Iv3s0pTHgZ7JidB5W3EaRRgatw_goZNwPKNCJo00VoyeA228pJryCzWi13v1qZXveE933S5uWP35lHJFo0hF8HGFPKvu6UpNOs',
      },
      rewards: [{ position: '1st Winner', amount: 1200 }, { position: '2nd Winner', amount: 800 }],
      judgingParameters: 'Bhavana, Raaga, and Thaala precision.',
      rules: 'Full solo performance.',
      eligibility: 'All Bharatanatyam practitioners.',
    });

    // --- Scenario D: SUBMISSION_OPEN ---
    const compD = await Competition.create({
      title: 'Kathak Innovation Fest',
      category: 'Dance',
      description: 'Modern classical fusion and traditional Kathak solos.',
      prizePool: 2500,
      entryFee: 120,
      maxParticipants: 30,
      registeredParticipants: 15,
      registrationStart: new Date(now.getTime() - 15 * day),
      registrationEnd: new Date(now.getTime() - 1 * day),
      submissionStart: new Date(now.getTime() - 1 * day), // Currently OPEN for submission!
      submissionEnd: new Date(now.getTime() + 7 * day),
      resultDate: new Date(now.getTime() + 14 * day),
      status: 'SUBMISSION_OPEN',
      judge: {
        name: 'Manju Dubey',
        profession: 'Kathak Legend',
        experience: '15 years',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFNqHvMzh8Ui713VpHW6BZzYr04_AlGdM_I85e5SBNFnvDP11T82QPxOCrRHNkR6SsFMzLUn2UW64jKR2C1iPk3xHMDtxBXujSb9OxMwlqKpOBs9xF0SwmAW9m7Bg-esLna4oUfsXltfrxTRTWJsz71PF7miTHgPpq0Iv3s0pTHgZ7JidB5W3EaRRgatw_goZNwPKNCJo00VoyeA228pJryCzWi13v1qZXveE933S5uWP35lHJFo0hF8HGFPKvu6UpNOs',
      },
      rewards: [{ position: '1st Winner', amount: 1500 }, { position: '2nd Winner', amount: 1000 }],
      judgingParameters: 'Footwork (Chakkar & Tatkar) and Speed.',
      rules: 'Video submission required.',
      eligibility: 'Registered dancers only.',
    });

    // --- Scenario E: RESULTS_PUBLISHED / COMPLETED ---
    const compE = await Competition.create({
      title: 'Odissi Masters Showcase 2025',
      category: 'Dance',
      description: 'Annual Odissi masters event with published national winners.',
      prizePool: 5000,
      entryFee: 200,
      maxParticipants: 40,
      registeredParticipants: 40,
      registrationStart: new Date(now.getTime() - 60 * day),
      registrationEnd: new Date(now.getTime() - 40 * day),
      submissionStart: new Date(now.getTime() - 39 * day),
      submissionEnd: new Date(now.getTime() - 15 * day),
      resultDate: new Date(now.getTime() - 2 * day), // Result announced 2 days ago!
      status: 'RESULTS_PUBLISHED',
      judge: {
        name: 'Guru Sujata Mohapatra',
        profession: 'Odissi Exponent',
        experience: '28 years',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFNqHvMzh8Ui713VpHW6BZzYr04_AlGdM_I85e5SBNFnvDP11T82QPxOCrRHNkR6SsFMzLUn2UW64jKR2C1iPk3xHMDtxBXujSb9OxMwlqKpOBs9xF0SwmAW9m7Bg-esLna4oUfsXltfrxTRTWJsz71PF7miTHgPpq0Iv3s0pTHgZ7JidB5W3EaRRgatw_goZNwPKNCJo00VoyeA228pJryCzWi13v1qZXveE933S5uWP35lHJFo0hF8HGFPKvu6UpNOs',
      },
      rewards: [{ position: '1st Winner', amount: 3000 }, { position: '2nd Winner', amount: 2000 }],
      previousWinners: [
        { name: 'Kavita Das', position: '1st Winner', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAB66rxu0vws07TYIJZ2AuM0mt_0-zwUAHTslgCQL_zDManjIqltPtx51tFgClz3h1Z1ZzFfnHgF0g87_3Ci3qJV_f9iMbRjiTbg2jlur0ACQoOZQ-DMKT-x7NUlERhJoVknheSOmNH_l1Dwg05t52_nGTBrRiVW8BPps7jzaaeAVU_skd23FaSeihP6BjgG_xeUzmtANLO_oO6fKBDzXR6uC8tlL1Ui5_r_sdXUn9ot1fuCaXKo5mesU5bwtLcmLfdYe4' },
      ],
      judgingParameters: 'Tribhangi postures and Expressive eyes.',
      rules: 'Completed stage performance.',
      eligibility: 'National level dancers.',
    });

    // 4. Create Initial Registration for Demo User on Comp A & Comp D
    await Participation.create({
      userId: demoUser._id,
      competitionId: compA._id,
      status: 'REGISTERED',
      paymentStatus: 'COMPLETED',
    });

    console.log(`[Seed] Seeded 5 Realistic Competition Scenarios successfully!`);
    console.log(`- Comp A (REGISTRATION_OPEN): ${compA._id}`);
    console.log(`- Comp B (REGISTRATION_FULL): ${compB._id}`);
    console.log(`- Comp C (REGISTRATION_CLOSED): ${compC._id}`);
    console.log(`- Comp D (SUBMISSION_OPEN): ${compD._id}`);
    console.log(`- Comp E (RESULTS_PUBLISHED): ${compE._id}`);

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
