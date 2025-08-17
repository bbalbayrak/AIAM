'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Agencies', 'agency_name', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    });
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.removeColumn('Agencies', 'agency_name');
  },
};
