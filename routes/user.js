module.exports = (app) => {
    const user = require('../controller/user');

    let router = require('express').Router();

    //Create a new user
    router.post('/', user.save);

    //search all user
    router.get('/', user.findAll);

    app.use('/api/user', router);
};