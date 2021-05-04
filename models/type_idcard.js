module.exports = (sequelize, Sequelize) => {
  const type_idcard = sequelize.define(
    "type_idcard",
    {
      idtype_idcard: {
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
  return type_idcard;
};
