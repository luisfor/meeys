module.exports = (app) => {
    const user = require('../controller/user');

    let router = require('express').Router();

    //Create a new user
    router.post('/', user.save);

    app.use('/api/user', router);
};