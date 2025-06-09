'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcryptjs')
module.exports = {

  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('users', [{
      name: 'Admin',
      email: 'admin@campus2go.luisteixeira.dev',
      password: bcrypt.hashSync('admin', 10),
      role: "admin",
      active: true
    },
    {
      name: 'Promoter',
      email: 'promoter@campus2go.luisteixeira.dev',
      password: bcrypt.hashSync('promoter', 10),
      role: "promoter",
      active: true
    },
    {
      name: 'Client',
      email: 'client@campus2go.luisteixeira.dev',
      password: bcrypt.hashSync('client', 10),
      role: "client",
      active: true
    }], {});

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
