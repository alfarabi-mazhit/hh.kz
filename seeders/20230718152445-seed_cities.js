"use strict";
const Country = require("../app/region/Country");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const countryRows = await Country.findAll();
    const citiesData = [
      { name: "Москва", countryId: countryRows[0].id },
      { name: "Санкт-Петербург", countryId: countryRows[0].id },
      { name: "Новосибирск", countryId: countryRows[0].id },
      { name: "Екатеринбург", countryId: countryRows[0].id },
      { name: "Казань", countryId: countryRows[0].id },
      { name: "Нижний Новгород", countryId: countryRows[0].id },
      { name: "Челябинск", countryId: countryRows[0].id },
      { name: "Самара", countryId: countryRows[0].id },
      { name: "Омск", countryId: countryRows[0].id },
      { name: "Ростов-На-Дону", countryId: countryRows[0].id },
      { name: "Киев", countryId: countryRows[1].id },
      { name: "Харьков", countryId: countryRows[1].id },
      { name: "Одесса",  countryId: countryRows[1].id },
      { name: "Днепр", countryId: countryRows[1].id },
      { name: "Донецк", countryId: countryRows[1].id },
      { name: "Запорожье", countryId: countryRows[1].id },
      { name: "Львов", countryId: countryRows[1].id },
      { name: "Кривой Рог", countryId: countryRows[1].id },
      { name: "Николаев", countryId: countryRows[1].id },
      { name: "Мариуполь", countryId: countryRows[1].id },
      { name: "Минск", countryId: countryRows[2].id },
      { name: "Гомель", countryId: countryRows[2].id },
      { name: "Могилев", countryId: countryRows[2].id },
      { name: "Витебск", countryId: countryRows[2].id },
      { name: "Гродно", countryId: countryRows[2].id },
      { name: "Брест", countryId: countryRows[2].id },
      { name: "Алматы", countryId: countryRows[3].id },
      { name: "Астана", countryId: countryRows[3].id },
      { name: "Шымкент", countryId: countryRows[3].id },
      { name: "Караганда", countryId: countryRows[3].id },
      { name: "Актобе", countryId: countryRows[3].id },
      { name: "Тараз", countryId: countryRows[3].id },
      { name: "Павлодар", countryId: countryRows[3].id },
      { name: "Ереван", countryId: countryRows[4].id },
      { name: "Гюмри", countryId: countryRows[4].id },
      { name: "Ванадзор", countryId: countryRows[4].id },
      { name: "Армавир", countryId: countryRows[4].id },
      { name: "Баку", countryId: countryRows[5].id },
      { name: "Гянджа", countryId: countryRows[5].id },
      { name: "Сумгайыт", countryId: countryRows[5].id },
      { name: "Ленкорань", countryId: countryRows[5].id },
      { name: "Тбилиси", countryId: countryRows[6].id },
      { name: "Кутаиси", countryId: countryRows[6].id },
      { name: "Батуми", countryId: countryRows[6].id },
      { name: "Рустави", countryId: countryRows[6].id },
      { name: "Kишинев", countryId: countryRows[7].id },
      { name: "бельчы", countryId: countryRows[7].id },
      { name: "Tиpaсполь", countryId: countryRows[7].id },
      { name: "бендеры", countryId: countryRows[7].id },
      { name: "Душанбе", countryId: countryRows[8].id },
      { name: "Худжанд", countryId: countryRows[8].id },
      { name: "Куляб", countryId: countryRows[8].id },
      { name: "Курган-Тюбе", countryId: countryRows[8].id },
      { name: "Ашхабад", countryId: countryRows[9].id },
      { name: "Туркменабад", countryId: countryRows[9].id },
      { name: "Дашогуз", countryId: countryRows[9].id },
      { name: "Мары", countryId: countryRows[9].id },
      { name: "Ташкент", countryId: countryRows[10].id },
      { name: "Самарканд", countryId: countryRows[10].id },
      { name: "Наманган", countryId: countryRows[10].id },
      { name: "Андижан", countryId: countryRows[10].id },
      { name: "Бишкек", countryId: countryRows[11].id },
      { name: "Ош", countryId: countryRows[11].id },
      { name: "Джалал-Абад", countryId: countryRows[11].id },
      { name: "Каракол", countryId: countryRows[11].id },
    ];
    await queryInterface.bulkInsert("Cities", citiesData, {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Cities", null, {});
  },
};
