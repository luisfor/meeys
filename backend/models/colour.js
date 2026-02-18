module.exports = (sequelize, Sequelize) => {
  const colour = sequelize.define(
    "colour",
    
    {
      idcolour: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      colour: Sequelize.STRING,
      createdAt: Sequelize.DATEONLY,
      updatedAt: Sequelize.DATEONLY,
    },
    {
      indexes: [{ unique: true, fields: ["colour"] }],
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
    }
  );

  return colour;
};
