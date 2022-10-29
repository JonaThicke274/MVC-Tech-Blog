// Import the Sequelize constructor from the library
const Sequelize = require('sequelize');

require('dotenv').config();


// Create connection to our database, pass in your MySQL info for user name and password
const sequelize = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL)
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
      host: 'localhost',
      dialect: 'mysql',
      dialectOptions: {
        decimalNumbers: true,
      },
})


module.exports = sequelize;