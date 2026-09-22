const mongoose = require('mongoose');

const participationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['REGISTERED', 'PAYMENT_PENDING', 'SUBMISSION_PENDING', 'SUBMITTED', 'UNDER_REVIEW', 'COMPLETED', 'WINNER'],
      default: 'REGISTERED',
    },
    paymentStatus: {
      type: String,
      enum: ['NONE', 'PENDING', 'COMPLETED', 'FAILED'],
      default: 'COMPLETED',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound Unique Index to prevent duplicate user registration for the same competition
participationSchema.index({ userId: 1, competitionId: 1 }, { unique: true });

module.exports = mongoose.model('Participation', participationSchema);
