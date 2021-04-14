module.exports = (app) => {
    const user = require('../controller/user');

    let router = require('express').Router();

    router.post('/activedirectory', user.activedirectory);

    app.use('/api/user', router);
};