'use strict'

module.exports = (app) => {
    const grade = require('../controller/grade');
    let router = require('express').Router();

    //create a new grade
    router.post('/', grade.save);

    //search all grade
    router.get('/', grade.findAll);

    //search for by id
    router.get('/:id', grade.findOne);

    //delete grade for by id
    router.delete('/:id', grade.delete);






    app.use('/api/grade', router);
};