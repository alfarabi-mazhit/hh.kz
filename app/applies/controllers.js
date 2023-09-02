const Apply = require("./Apply");
const { NEW, INVITATION, DECLINED } = require("./utils");
const sendEMail = require("../utils/sendMail");
const Vacancy = require("../vacancy/models/Vacancy");
const Resume = require("../resume/models/Resume");
const User = require("../auth/User");
const { Op } = require("sequelize");
const Company = require("../auth/Company");

const createApply = async (req, res) => {
  try {
    const [apply, created] = await Apply.findOrCreate({
      resumeId: req.body.resumeId,
      vacancyId: req.body.vacancyId,
      status: NEW,
    });
    if (created) {
      const resume = await Resume.findByPk(req.body.resumeId);
      const vacancy = await Vacancy.findByPk(req.body.vacancyId);
      const user = await User.findByPk(vacancy.userId);
      sendEMail(
        user.email,
        `Новый отклик на вакансию "${vacancy.name}"`,
        `
          Имя соискателя - ${resume.first_name},
          Фамилия соискателя - ${resume.last_name},
          Номер телефона - ${resume.phone},
          `
      );
      res.status(200).send(apply);
    } else {
      res.status(300).send({ message: "Apply is already sent" });
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const getEmployeeApplies = async (req, res) => {
  const resumes = await Resume.findAll({
    where: {
      userId: req.user.id,
    },
  });
  const ids = resumes.map((item) => item.id);

  const applies = await Apply.findAll({
    where: {
      resumeId: { [Op.in]: ids },
    },
    include: {
      model: Vacancy,
      as: "vacancy",
    },
  });
  res.status(200).send(applies);
};

const deleteApply = async (req, res) => {
  await Apply.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).end();
};

const acceptEmployee = async (req, res) => {
  await Apply.update(
    {
      status: INVITATION,
    },
    {
      where: {
        id: req.body.applyId,
      },
    }
  );
  const apply = await Apply.findByPk(req.body.applyId);
  const vacancy = await Vacancy.findByPk(apply.vacancyId);
  const resume = await Resume.findByPk(apply.resumeId);
  const user = await User.findByPk(resume.userId);
  const company = await Company.findByPk(req.user.companyId);
  console.log(user.email);
  sendEMail(
    user.email,
    `Вы были приглашены на вакансию ${vacancy.name}`,
    `Компания: ${company.name}, пригласила вас на вакансию: ${vacancy.name}, приходите по адресу: ${company.address} или свяжитесь с Менеджером ${req.user.full_name}, ${req.user.phone}, ${req.user.email}`
  );
  res.status(200).end();
};
const declineEmployee = async (req, res) => {
  await Apply.update(
    {
      status: DECLINED,
    },
    {
      where: {
        id: req.body.applyId,
      },
    }
  );
  const apply = await Apply.findByPk(req.body.applyId);
  const vacancy = await Vacancy.findByPk(apply.vacancyId);
  const resume = await Resume.findByPk(apply.resumeId);
  const user = await User.findByPk(resume.userId);
  const company = await Company.findByPk(req.user.companyId);
  sendEMail(
    user.email,
    `Отказ на вакансию ${vacancy.name}`,
    `Компания: ${company.name}, к сожалению ваша кандидатура не подходит на вакансию: ${vacancy.name},`
  );
  res.status(200).end();
};

const getVacancyApplies = async (req, res) => {
  const options = {
    vacancyId: req.params.id,
  };
  if (
    (req.query.status && req.query.status === NEW) ||
    req.query.status === INVITATION ||
    req.query.status === DECLINED
  ) {
    options.status = req.query.status;
  }
  const applies = await Apply.findAll({
    where: options,
    include: {
      model: Resume,
      as: "resume",
    },
  });
  res.status(200).send(applies);
};

module.exports = {
  createApply,
  getEmployeeApplies,
  deleteApply,
  acceptEmployee,
  declineEmployee,
  getVacancyApplies,
};
