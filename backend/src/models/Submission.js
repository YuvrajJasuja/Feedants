const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
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
    mediaUrl: {
      type: String,
      required: [true, 'Media URL is required'],
    },
    title: {
      type: String,
      required: [true, 'Submission title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['UPLOADED', 'UNDER_REVIEW', 'REJECTED', 'ACCEPTED', 'WINNER'],
      default: 'UPLOADED',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

submissionSchema.index({ userId: 1, competitionId: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
