"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Vacancies", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      salary_from: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      salary_to: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      salary_type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      skills: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      about_company: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      cityId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Cities",
          key: "id",
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      companyId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Companies",
          key: "id",
        },
      },
      specializationId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Specializations",
          key: "id",
        },
      },
      experienceId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Experiences",
          key: "id",
        },
      },
      EmploymentTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: "EmploymentTypes",
          key: "id",
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Vacancies");
  },
};
