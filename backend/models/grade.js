module.exports = (sequelize, Sequelize) => {
    const grade = sequelize.define(
      "grade",
      {
        idgrade: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        name: Sequelize.STRING,
        createdAt: Sequelize.DATEONLY,
        updatedAt: Sequelize.DATEONLY,
      },
      {
        indexes: [
          { unique: true, fields: ["name"] },
        ],
        freezeTableName: true,
        timestamps: false,
        createdAt: false,
      }
    );
    return grade;
  };