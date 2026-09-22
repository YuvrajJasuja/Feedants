const mongoose = require('mongoose');

const judgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    profession: { type: String, required: true },
    experience: { type: String, required: true },
    videoUrl: { type: String, default: '' },
  },
  { _id: false }
);

const rewardSchema = new mongoose.Schema(
  {
    position: { type: String, required: true },
    amount: { type: Number, required: true },
    label: { type: String, default: '' },
  },
  { _id: false }
);

const previousWinnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    image: { type: String, required: true },
    videoUrl: { type: String, default: '' },
    prizeAmount: { type: String, default: '' },
  },
  { _id: false }
);

const competitionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    prizePool: { type: Number, required: true, min: 0 },
    entryFee: { type: Number, required: true, min: 0 },
    maxParticipants: { type: Number, required: true, min: 1 },
    registeredParticipants: { type: Number, default: 0, min: 0 },
    registrationStart: { type: Date, required: true },
    registrationEnd: { type: Date, required: true },
    submissionStart: { type: Date, required: true },
    submissionEnd: { type: Date, required: true },
    resultDate: { type: Date, required: true },
    status: {
      type: String,
      default: 'UPCOMING',
      enum: [
        'UPCOMING',
        'REGISTRATION_OPEN',
        'REGISTRATION_CLOSED',
        'SUBMISSION_OPEN',
        'SUBMISSION_CLOSED',
        'JUDGING',
        'RESULTS_PUBLISHED',
        'COMPLETED',
      ],
    },
    judge: { type: judgeSchema, required: true },
    previousWinners: [previousWinnerSchema],
    judgingParameters: { type: String, required: true },
    rules: { type: String, required: true },
    eligibility: { type: String, required: true },
    rewards: [rewardSchema],
    images: {
      heroImage: { type: String, default: '' },
      bannerImage: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

competitionSchema.index({ status: 1, category: 1 });

module.exports = mongoose.model('Competition', competitionSchema);
