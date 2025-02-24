'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Kategorileri ekliyoruz
    await queryInterface.bulkInsert('categories', [
      {
        name: 'Telefon',
        description: "İletişim Cihazı",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Buzdolabı',
        description: "Beyaz Eşya",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Kategorileri geri alıyoruz
    await queryInterface.bulkDelete('categories', null, {});
  }
};
