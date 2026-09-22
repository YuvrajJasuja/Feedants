const app = require('./app');
const env = require('./config/env');
const { connectDB } = require('./config/database');
const Competition = require('./models/Competition');
const User = require('./models/User');

const seedInitialDataIfNeeded = async () => {
  const count = await Competition.countDocuments();
  if (count === 0) {
    console.log('[Auto-Seed] No competitions found. Seeding initial Feedants Classical Dance competition...');
    const demoUser = await User.create({
      name: 'Rohan Sharma',
      email: 'rohan.sharma@example.com',
      passwordHash: 'hashed_password_secure_123',
      profileImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvuG3miwQBhKj1zIdyGpkitYoDWw-jDJnPBZcXk-vZi_Bns7AyobGEcQJxqjQdGnijg6YjDcxUgJcY_nRptIfBPw5LkYCtQU7739LsYkv62DbD_zqNaWlJ2FAgi3LUbPlOmV5HILmjeR62YyNqEIT4Dy0YJxIiHQipFAqEObublXLa17u7bE4KJEiP0ykAatvAuDczQSTTGzhWHb6i8pVVY9ghOh5XUINe-1nXLfxOKXh3epGaTANR89_yShR_UjIXTM0',
    });

    const now = new Date();
    const regStart = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    const regEnd = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
    const subStart = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const subEnd = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
    const resultDate = new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000);

    await Competition.create({
      title: 'Feedants Classical Dance',
      category: 'Dance',
      description: 'Showcase your talent, celebrate tradition, and let your passion dance its way to glory! This is an online classical dance competition open to all age groups.',
      prizePool: 1500,
      entryFee: 99,
      maxParticipants: 20,
      registeredParticipants: 1,
      registrationStart: regStart,
      registrationEnd: regEnd,
      submissionStart: subStart,
      submissionEnd: subEnd,
      resultDate: resultDate,
      status: 'REGISTRATION_OPEN',
      judge: {
        name: 'Manju Dubey',
        profession: 'Professional Kathak Dancer',
        experience: '12+ years of experience',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFNqHvMzh8Ui713VpHW6BZzYr04_AlGdM_I85e5SBNFnvDP11T82QPxOCrRHNkR6SsFMzLUn2UW64jKR2C1iPk3xHMDtxBXujSb9OxMwlqKpOBs9xF0SwmAW9m7Bg-esLna4oUfsXltfrxTRTWJsz71PF7miTHgPpq0Iv3s0pTHgZ7JidB5W3EaRRgatw_goZNwPKNCJo00VoyeA228pJryCzWi13v1qZXveE933S5uWP35lHJFo0hF8HGFPKvu6UpNOs',
        videoUrl: 'https://www.youtube.com/watch?v=sample_judge_video',
      },
      rewards: [
        { position: '1st Winner', amount: 550, label: 'Grand Prize' },
        { position: '2nd Winner', amount: 300, label: 'Runner Up' },
        { position: '3rd Winner', amount: 240, label: '2nd Runner Up' },
        { position: '4th Winner', amount: 200, label: 'Special Mention' },
        { position: '5th Winner', amount: 120, label: 'Promising Talent' },
        { position: '6th Winner', amount: 80, label: 'Participation Award' },
      ],
      previousWinners: [
        {
          name: 'Riya Sinha',
          position: '1st Winner',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAB66rxu0vws07TYIJZ2AuM0mt_0-zwUAHTslgCQL_zDManjIqltPtx51tFgClz3h1Z1ZzFfnHgF0g87_3Ci3qJV_f9iMbRjiTbg2jlur0ACQoOZQ-DMKT-x7NUlERhJoVknheSOmNH_l1Dwg05t52_nGTBrRiVW8BPps7jzaaeAVU_skd23FaSeihP6BjgG_xeUzmtANLO_oO6fKBDzXR6uC8tlL1Ui5_r_sdXUn9ot1fuCaXKo5mesU5bwtLcmLfdYe4',
        },
        {
          name: 'Aarav Mehta',
          position: '2nd Winner',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDonfD9lYLN_UlUQ0lrpZGufnAVXBlwN2_we6ZDqYiBEeOy5T8RjTrY-4f7N4CT5FFR6zPfev7CNxfpQn08IW2dtIMvxmhTRYQeW7SshglSIJv1Hk8pA2Pam33kyflRnNuRJL_IzYxnKyMgFjiPbrBS0uka8vDzgNaUKDdiXkUmcC13YI531hkfDd5sFV8friqg67DajsXmP7SWF9RXCF9ByH7v-dxDO_jmJX5zJjVk26f_ZMBaUwaW6COGe6fWU3s0cMU',
        },
        {
          name: 'Neha Verma',
          position: '3rd Winner',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPwuMOWzc1Vakffx0iQ-XhXDahDLh2A5-OUHSngzAZPb4vRprPRhCcMbrEKTJKn76rS0pT_QkDrWug5Kt_hcKUViwWWtNk9gicfDORDErpDHe0xJ5SeeIM5F7v538GLkrQBINvmhR74ns821naqK2HYj8F0tkKNX6kApU-DgBj33hLiOJV8xN7KuSInywE5o8NAzo9k5p7KKDw3RXbmb3cg50itxHBlQeABpWq7T7OUr_Mc7TmZc4FtlbidSxI7qYI1Zw',
        },
        {
          name: 'Vikram Rao',
          position: '4th Winner',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBV7Tu5cuFZsKZpBNb54Qm92wYjL4rG4hbKOEgbLIM0EEhdQbxOcCszIWoZwbivL4FHeGmm-IZ1e-FLNWXvfqyp8qxpJqWf0iYzceOWDdRXCvAmImmmrEY62_nQ2hw-BUdO9hlxCFv1HyQIPJt_f1YS2JWVX7UKeuqvGh7lBOGysqo2xh-3ppHsRbfQalbxjmeNY5E_Sd6gRCy4C-vgRHLeLTZnPAh4BFwVRgUsBMLSOLu7Czmprf0HvTHKm3MQMlKsZ1E',
        },
      ],
      judgingParameters: 'Submissions are judged based on Rhythm & Tempo (Taal), Expressions (Abhinaya), Choreography, Costume & Authenticity, and Overall Stage Presence.',
      rules: 'Participants must record a clear video of minimum 1 min and maximum 3 mins. Only classical dance forms (Kathak, Bharatanatyam, Odissi, Kuchipudi, etc.) are allowed.',
      eligibility: 'Open to all age groups and skill levels across India.',
      images: {
        heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOASx6Mo2Vh7okDWxb2wHJ7rIFwn_VpN6wNlGJDg1rpQoX2hXlh4Vu0nExFPXIR1g7P_sCgjJuVoyudUarLHfvejcWgdKYwQrC-Vp6JYzdg8YCuezELwrwwdQp0VQRV1Ayzx11ktwD6HKiLOVGAWo8s0q9v2J1AnJHC8g3zhhLw5O0kYOVPhynAQPIs-w8yqD9NydUHCqeUHrKmDUVILVmmRpGkr8dsNcGh26ImdzyA-aE-EMIN-3a-58lO4_LZ4XbBtg',
      },
    });

    console.log('[Auto-Seed] Initial Feedants Classical Dance competition seeded successfully!');
  }
};

const startServer = async () => {
  await connectDB();
  await seedInitialDataIfNeeded();

  const server = app.listen(env.port, () => {
    console.log(`[Feedants Server] Server running in ${env.nodeEnv} mode on http://localhost:${env.port}`);
  });

  const handleShutdown = async (signal) => {
    console.log(`[Feedants Server] ${signal} received. Closing HTTP server...`);
    server.close(() => {
      console.log('[Feedants Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
};

startServer();
