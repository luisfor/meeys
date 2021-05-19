//use database configuration
const dbConfig = require("../config/db.config");
const db = {};

const Sequelize = require("sequelize");
const conexion = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    benchmark: false,
    logging: false,
    force: false,
    alter: true,
    dialectOptions: {
      timezone: process.env.db_timezone
    },
    //database connection pool
    pool: {
        //maximum in connections
        max: dbConfig.pool.max,
        //minimum number of connections
        min: dbConfig.pool.min,
        //maximum time in millisecond in which it will try to obtain the connection before throwing an error
        acquire: dbConfig.pool.acquire,
        //maximum time in milliseconds that a connection can be idle before being released
        idle: dbConfig.pool.idle,
      }
});

//Verification of the connection to the server
conexion
  .authenticate()
  .then(() => {
    console.log("established connection");
  })
  .catch(err => {
    console.error("problems in the connection with the database", err);
  });

db.Sequelize = Sequelize;
db.conexion = conexion;

//import of the models
db.user = require("./user")(conexion, Sequelize);
db.state = require("./state")(conexion, Sequelize);
db.colour = require("./colour")(conexion, Sequelize);
db.type_idcard = require("./type_idcard")(conexion, Sequelize);


//table association type of identification card with status fk
db.type_idcard.belongsTo(db.state, {
  foreignKey: 'fktype_idcardState',
  as: 'state',
});

//table association user with type of identification fk
db.user.belongsTo(db.type_idcard, {
  foreignKey: 'fkuserType_idcard',
  as: 'type_idcard',
});

//table association user with status fk
db.user.belongsTo(db.state, {
  foreignKey: 'fkuserState',
  as: 'state',
});

module.exports = db;