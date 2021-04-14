module.exports = (sequelize, Sequelize) => {
    const user = sequelize.define('user', {
      iduser: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      fname: Sequelize.STRING,
      sname: Sequelize.STRING,
      flastname: Sequelize.STRING,
      slastname: Sequelize.STRING,
      identification: Sequelize.BIGINT,
      email: Sequelize.STRING,
      password: Sequelize.STRING,
      idState: Sequelize.BIGINT,
      createdAt: Sequelize.DATEONLY,
      updatedAt: Sequelize.DATEONLY,
  
    },
    {
      indexes: [
        {unique:true, fields:['email']},
        {unique:true, isNumeric: true, fields:['identification']},
        {unique:true, isNumeric: true, fields:['idState']},
        {unique:true, isNumeric: true, fields:['iduser']}
      ],
      freezeTableName: true,
      timestamps: false,
      createdAt: false
    });
  
    return user;
  
  }