module.exports = (app) => {
    const user = require('../controller/user');

    let router = require('express').Router();

    //Create a new user
    router.post('/', user.save);

    //search all user
    router.get('/', user.findAll);

    //search for by id
    router.get('/:id', user.findOne);

    //search by identication
    router.get('/search/:search', user.findIdentificacion);

     //search by email
     router.get('/email/:email', user.findEmail);

     //Login User
     router.post('/login', user.login);

    app.use('/api/user', router);
};