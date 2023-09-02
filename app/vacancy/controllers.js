const Company = require("../auth/Company");
const EmploymentType = require("../employment-type/EmploymentType");
const City = require("../region/City");
const Specialization = require("../specializations/models/Specialization");
const Experience = require("./models/Experience");
const Vacancy = require("./models/Vacancy");
const { Op } = require("sequelize");

const getExperiences = async (req, res) => {
  const experiences = await Experience.findAll();
  res.status(200).send(experiences);
};

const createVacancy = async (req, res) => {
  const vacancy = await Vacancy.create({
    name: req.body.name,
    salary_from: req.body.salary_from,
    salary_to: req.body.salary_to,
    salary_type: req.body.salary_type,
    address: req.body.address,
    description: req.body.description,
    skills: req.body.skills,
    about_company: req.body.about_company,
    cityId: req.body.cityId,
    userId: req.user.id,
    companyId: req.user.companyId,
    specializationId: req.body.specializationId,
    experienceId: req.body.experienceId,
    employmentTypeId: req.body.employmentTypeId,
  });
  res.status(200).end();
};

const getMyVacancies = async (req, res) => {
  const vacancies = await Vacancy.findAll({
    where: {
      companyId: req.user.companyId,
    },
  });
  res.status(200).send(vacancies);
};

const getVacancy = async (req, res) => {
  const vacancy = await Vacancy.findByPk(req.params.id, {
    include: [
      {
        model: City,
        as: "city",
      },
      {
        model: Experience,
        as: "experience",
      },
      {
        model: Specialization,
        as: "specialization",
      },
      {
        model: Company,
        as: "company",
      },
      {
        model: EmploymentType,
        as: "employmentType",
      },
    ],
  });
  if (vacancy) {
    res.status(200).send(vacancy);
  } else {
    res.status(404).send({ message: "Vacancy was not found" });
  }
};

const deleteVacancy = async (req, res) => {
  await Vacancy.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).end();
};

const editVacancy = async (req, res) => {
  const vacancy = await Vacancy.update(
    {
      name: req.body.name,
      salary_from: req.body.salary_from,
      salary_to: req.body.salary_to,
      salary_type: req.body.salary_type,
      address: req.body.address,
      description: req.body.description,
      skills: req.body.skills,
      about_company: req.body.about_company,
      cityId: req.body.cityId,
      userId: req.user.id,
      companyId: req.user.companyId,
      specializationId: req.body.specializationId,
      experienceId: req.body.experienceId,
      employmentTypeId: req.body.employmentTypeId,
    },
    {
      where: {
        id: req.params.id || req.body.id,
      },
    }
  );
  res.status(200).end();
};

const searchVacancy = async (req, res) => {
  const options = {};
  const {
    q,
    specializationId,
    cityId,
    employmentTypeId,
    salary,
    salary_type,
    experienceId,
  } = req.query;
  if (q) {
    options[Op.or] = [
      { name: { [Op.iLike]: `%${q}%` } },
      { description: { [Op.iLike]: `%${q}%` } },
      { about_company: { [Op.iLike]: `%${q}%` } },
      { skills: { [Op.iLike]: `%${q}%` } },
    ];
  }
  if (specializationId) {
    options.specializationId = specializationId;
  }
  if (cityId) {
    options.cityId = cityId;
  }
  if (employmentTypeId) {
    options.employmentTypeId = employmentTypeId;
  }
  if (experienceId) {
    options.experienceId = experienceId;
  }
  if (salary_type) {
    options.salary_type = salary_type;
  }
  if (salary) {
    options.salary_from = { [Op.lte]: salary };
    options.salary_to = { [Op.gte]: salary };
  }

  const vacancies = await Vacancy.findAll({
    where: options,
  });
  res.status(200).send(vacancies);
};

module.exports = {
  getExperiences,
  createVacancy,
  getMyVacancies,
  getVacancy,
  deleteVacancy,
  editVacancy,
  searchVacancy,
};
