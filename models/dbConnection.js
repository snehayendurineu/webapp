const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
const logger = require('../loggerModel.js');

const { DB_NAME, DB_USER, DB_PASSWORD,DB_HOST,DB_DIALECT} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
});

const db ={}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.users = require('./userModel.js')(sequelize,DataTypes)

db.sequelize.sync({force:false})
.then(()=>{
  console.log('resync completed')
  logger.info('resync completed')
})


module.exports = db;
