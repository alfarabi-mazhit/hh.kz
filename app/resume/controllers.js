const Resume = require("./models/Resume");
const WorkingHistory = require("./models/WorkingHistory");
const Education = require("./models/Education");
const ForeignLanguage = require("./models/ForeignLanguage");
const ResumeEmploymentType = require("./models/ResumeEmploymentType");
const EmploymentType = require("../employment-type/EmploymentType");
const City = require("../region/City");
const Country = require("../region/Country");
const { Op } = require("sequelize");

const createResume = async (req, res) => {
  const resume = await Resume.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    phone: req.body.phone,
    position: req.body.position,
    cityId: req.body.cityId,
    citizenship: req.body.citizenship,
    about: req.body.about,
    birthday: req.body.birthday,
    gender: req.body.gender,
    salary: req.body.salary,
    salary_type: req.body.salary_type,
    main_language: req.body.main_language,
    skills: req.body.skills,
    userId: req.user.id,
  });
  if (req.body.workingHistories && req.body.workingHistories.length > 0) {
    req.body.workingHistories.forEach(async (history) => {
      await WorkingHistory.create({
        resumeId: resume.id,
        company_name: history.company_name,
        company_description: history.company_description,
        responsibilities: history.responsibilities,
        start_date: history.start_date,
        end_date: history.end_date,
      });
    });
  }
  if (req.body.educations && req.body.educations.length > 0) {
    req.body.educations.forEach(async (edu) => {
      await Education.create({
        resumeId: resume.id,
        level: edu.level,
        university_name: edu.university_name,
        faculty: edu.faculty,
        major: edu.major,
        end_date: edu.end_date,
      });
    });
  }
  if (req.body.foreignLanguages && req.body.foreignLanguages.length > 0) {
    req.body.foreignLanguages.forEach(async (ln) => {
      await ForeignLanguage.create({
        resumeId: resume.id,
        level: ln.level,
        name: ln.name,
      });
    });
  }
  if (req.body.employmentTypes && req.body.employmentTypes.length > 0) {
    req.body.employmentTypes.forEach(async (employmentTypeId) => {
      await ResumeEmploymentType.create({
        resumeId: resume.id,
        employmentTypeId,
      });
    });
  }
  res.status(200).send(resume);
};
const getMyResumes = async (req, res) => {
  const resumes = await Resume.findAll({ where: { userId: req.user.id } });
  res.status(200).send(resumes);
};
const getResume = async (req, res) => {
  const resume = await Resume.findByPk(req.params.id, {
    include: [
      { model: WorkingHistory, as: "workingHistories" },
      { model: Education, as: "education" },
      { model: EmploymentType, as: "employmentTypes" },
      { model: ForeignLanguage, as: "foreignLanguages" },
      { model: City, as: "city" },
      { model: Country, as: "citizenshipObj" },
    ],
  });

  res.status(200).send(resume);
};
const deleteResume = async (req, res) => {
  await Resume.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).end();
};
const editResume = async (req, res) => {
  await Resume.update(
    {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone: req.body.phone,
      position: req.body.position,
      cityId: req.body.cityId,
      citizenship: req.body.citizenship,
      about: req.body.about,
      birthday: req.body.birthday,
      gender: req.body.gender,
      salary: req.body.salary,
      salary_type: req.body.salary_type,
      main_language: req.body.main_language,
      skills: req.body.skills,
      userId: req.user.id,
    },
    { where: { id: req.body.id } }
  );
  await WorkingHistory.destroy({ where: { resumeId: req.body.id } });
  await Education.destroy({ where: { resumeId: req.body.id } });
  await ResumeEmploymentType.destroy({ where: { resumeId: req.body.id } });
  await ForeignLanguage.destroy({ where: { resumeId: req.body.id } });
  const resume = { id: req.body.id };
  if (req.body.workingHistories && req.body.workingHistories.length > 0) {
    req.body.workingHistories.forEach(async (history) => {
      await WorkingHistory.create({
        resumeId: resume.id,
        company_name: history.company_name,
        company_description: history.company_description,
        responsibilities: history.responsibilities,
        start_date: history.start_date,
        end_date: history.end_date,
      });
    });
  }
  if (req.body.educations && req.body.educations.length > 0) {
    req.body.educations.forEach(async (edu) => {
      await Education.create({
        resumeId: resume.id,
        level: edu.level,
        university_name: edu.university_name,
        faculty: edu.faculty,
        major: edu.major,
        end_date: edu.end_date,
      });
    });
  }
  if (req.body.foreignLanguages && req.body.foreignLanguages.length > 0) {
    req.body.foreignLanguages.forEach(async (ln) => {
      await ForeignLanguage.create({
        resumeId: resume.id,
        level: ln.level,
        name: ln.name,
      });
    });
  }
  if (req.body.employmentTypes && req.body.employmentTypes.length > 0) {
    req.body.employmentTypes.forEach(async (employmentTypeId) => {
      await ResumeEmploymentType.create({
        resumeId: resume.id,
        employmentTypeId,
      });
    });
  }
  res.status(200).end();
};

const searchResume = async (req, res) => {
  const options = {};
  const { q, cityId, salary_from, salary_to, salary_type, citizenship } = req.query;
  if (q) {
    options[Op.or] = [
      { firstname: { [Op.iLike]: `%${q}%` } },
      { lastname: { [Op.iLike]: `%${q}%` } },
      { position: { [Op.iLike]: `%${q}%` } },
      { about: { [Op.iLike]: `%${q}%` } },
      { skills: { [Op.iLike]: `%${q}%` } },
    ];
  }
  if (citizenship) {
    options.citizenship = citizenship;
  }
  if (cityId) {
    options.cityId = cityId;
  }
  if (salary_from && !salary_to) {
    options.salary = { [Op.gte]: salary_from };
  } else if (!salary_from && salary_to) {
    options.salary = { [Op.lte]: salary_to };
  } else if (salary_from && salary_to) {
    options.salary = { [Op.between]: [salary_from, salary_to] };
  }
  if (salary_type) {
    options.salary_type = salary_type;
  }

  const resumes = await Resume.findAll({
    where: options,
  });
  res.status(200).send(resumes);
};

module.exports = {
  createResume,
  getMyResumes,
  getResume,
  deleteResume,
  editResume,
  searchResume,
};
