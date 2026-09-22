const submissionService = require('../services/submissionService');

const submitEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user ? (req.user.id || req.user._id) : req.body.userId;
    const { title, description, mediaUrl, videoUrl } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required to submit performance entry.',
        },
      });
    }

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
    const userId = req.user ? (req.user.id || req.user._id) : (req.query.userId || req.headers['x-user-id']);

    if (!userId) {
      return res.json({
        success: true,
        data: null,
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
