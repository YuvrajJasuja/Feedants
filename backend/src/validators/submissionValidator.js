function validateSubmission(req) {
  const userId = req.user ? (req.user.id || req.user._id) : req.body.userId;
  if (!userId) {
    return 'Authentication or userId is required for submission.';
  }

  const { title, videoUrl, mediaUrl } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return 'Submission title is required.';
  }

  const media = mediaUrl || videoUrl;
  if (!media || typeof media !== 'string' || !media.trim()) {
    return 'Video URL / Media URL is required.';
  }

  return null;
}

module.exports = {
  validateSubmission,
};
