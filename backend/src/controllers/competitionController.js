const competitionService = require('../services/competitionService');

const getCompetitions = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await competitionService.getAllCompetitions(page, limit);
    res.json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

const getCompetitionDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId || req.headers['x-user-id'] || null;

    const competitionDetails = await competitionService.getCompetitionById(id, userId);

    res.json({
      success: true,
      data: competitionDetails,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompetitions,
  getCompetitionDetails,
};
