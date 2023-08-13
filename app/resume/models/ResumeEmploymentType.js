const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db");
const EmploymentType = require("../../employment-type/EmploymentType");
const Resume = require("./Resume");

const ResumeEmploymentType = sequelize.define(
  "ResumeEmploymentTypes",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    timestamps: false,
  }
);

EmploymentType.belongsToMany(Resume, {
  through: ResumeEmploymentType,
  foreignKey: "resumeId",
});
Resume.belongsToMany(EmploymentType, {
  through: ResumeEmploymentType,
  foreignKey: "employmentTypeId",
  as: "employmentTypes",
});
module.exports = ResumeEmploymentType;
