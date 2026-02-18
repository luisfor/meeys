module.exports = (app) => {
    const state = require('../controller/state');

    let router = require('express').Router();

    //create a new state
    router.post('/', state.save);

    //search all state
    router.get('/', state.findAll);

    //search for by id
    router.get('/:id', state.findOne);

    //search for by name
    router.get('/search/:search', state.findName);

    //update state
    router.put('/:id', state.update);

     //delete state
     router.delete('/:id', state.delete);

    

    app.use('/api/state', router);
};