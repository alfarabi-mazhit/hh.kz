const Experience = require("./models/Experience");

const getExperiences = async (req, res) => {
  const experiences = await Experience.findAll({});
  res.status(200).send(experiences);
};

module.exports = { getExperiences };
