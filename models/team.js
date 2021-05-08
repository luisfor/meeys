module.exports = (sequelize, Sequelize) => {
  const team = sequelize.define(
    "team",
    {
      idteam_idcard: {
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
  return team;
};