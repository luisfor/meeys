
module.exports = (app) => {
  const colour = require("../controller/colour");

  let router = require("express").Router();

  //create a new colour
  router.post("/", colour.save);

  //search all colour
  router.get("/", colour.findAll);

  //search for by id
  router.get("/:id", colour.findOne);

  //update colour
  router.put("/:id", colour.update);

  //delete colour
  router.delete("/:id", colour.delete);

  app.use("/api/colour", router);
};
