module.exports = (app) => {
    const user = require('../controller/user');

    let router = require('express').Router();

    app.use('/api/user', router);
};