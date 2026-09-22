function validateRegistration(req) {
  const { userId } = req.body;
  if (!userId) {
    return 'userId is required for competition registration.';
  }
  return null;
}

module.exports = {
  validateRegistration,
};
