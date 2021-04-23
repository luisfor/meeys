module.exports = (sequelize, Sequelize) => {
    const state = sequelize.define('state', {
        idstate: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        name: Sequelize.STRING,
        

    });

    return state;

}