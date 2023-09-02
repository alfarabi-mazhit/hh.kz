const Resume = require("../resume/models/Resume");
const Apply = require("./Apply");
const Vacancy = require("../vacancy/models/Vacancy");
const validateApply = (req, res, next) => {
  let errors = {};
  if (!req.body.resumeId || req.body.resumeId.length <= 0) {
    errors.resumeId = "Поле Резюме обязательное";
  }
  if (!req.body.vacancyId || req.body.vacancyId.length <= 0) {
    errors.vacancyId = "Поле Вакансия обязательное";
  }
  if (JSON.stringify(errors) !== JSON.stringify({})) {
    res.status(400).send(errors);
  } else {
    next();
  }
};

const isAuthorOfApply = async (req, res, next) => {
  const id = req.params.id || req.body.id;
  const apply = await Apply.findByPk(id);
  if (!apply) {
    res.status(400).send({ message: "Apply is not exist" });
  } else {
    const resumes = await Resume.findAll({
      where: {
        userId: req.user.id,
      },
    });
    const ids = resumes.map((item) => item.id);
    if (ids.includes(id * 1)) {
      next();
    } else {
      res.status(401).send({ message: "Access forbidden" });
    }
  }
};
const isAuthorOfVacancy = async (req, res, next) => {
  const id = req.params.id || req.body.id;
  const vacancy = await Vacancy.findByPk(id);
  if (!vacancy) {
    res.status(402).send({ message: "Vacancy with that id does not exist" });
  } else if (vacancy.userId === req.user.id) {
    next();
  } else {
    res.status(403).send({ message: "Access Forbidden" });
  }
};
const isApplyExists = async (req, res, next) => {
  const apply = await Apply.findByPk(req.body.applyId);
  if (!apply) res.status(400).send({ message: "Apply with that id does not exist" });
  req.body.id = apply.vacancyId;
  next();
};
module.exports = {
  validateApply,
  isAuthorOfApply,
  isAuthorOfVacancy,
  isApplyExists,
};
