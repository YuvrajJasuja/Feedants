const submissionService = require('../services/submissionService');

const submitEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, title, description, mediaUrl, videoUrl } = req.body;

    const submission = await submissionService.createSubmission({
      competitionId: id,
      userId,
      title,
      description,
      mediaUrl,
      videoUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Submission received successfully!',
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

const getUserSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId || req.headers['x-user-id'];

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_USER_ID',
          message: 'userId is required.',
        },
      });
    }

    const submission = await submissionService.getSubmissionByUser(id, userId);

    res.json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitEntry,
  getUserSubmission,
};
