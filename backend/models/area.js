module.exports = (sequelize, Sequelize) => {
    const area = sequelize.define(
      "area",
      {
        idarea: {
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
    return area;
  };