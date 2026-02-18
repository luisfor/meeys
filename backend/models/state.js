module.exports = (sequelize, Sequelize) => {
  const state = sequelize.define(
    "state",
    {
      idstate: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      name: Sequelize.STRING,
      createdAt: Sequelize.DATEONLY,
      updatedAt: Sequelize.DATEONLY,
    },
    {
      indexes: [{ unique: true, fields: ["name"] }],
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
    }
  );

  return state;
}
