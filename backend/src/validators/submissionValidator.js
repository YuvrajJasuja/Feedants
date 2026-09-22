function validateSubmission(req) {
  const { userId, title, videoUrl, mediaUrl } = req.body;
  if (!userId) {
    return 'userId is required for submission.';
  }
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
