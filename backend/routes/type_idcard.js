module.exports = (app) => {
  const type_idcard = require("../controller/type_idcard");

  let router = require("express").Router();

  //create a new type idcard
  router.post("/", type_idcard.save);

  //search all type_idcard
  router.get("/", type_idcard.findAll);

  //search for by id
  router.get("/:id", type_idcard.findOne);

  //search for by name
  router.get("/search/:search", type_idcard.findName);

  //update type idcard
  router.put("/:id", type_idcard.update);

  //delete type idcard
  router.delete('/:id', type_idcard.delete);

  app.use("/api/type_idcard", router);
};
