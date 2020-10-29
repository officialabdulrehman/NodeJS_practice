const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "nizthedev", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;