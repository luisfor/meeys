const db = require("../models");
const { pool } = require("../config/db.config");
const moment = require("moment");

const Colour = db.colour;
const Op = db.Sequelize.Op;

let validator = require("validator");

//paging functions
const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };
  
  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: colour } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, data, totalPages, currentPage };
  };

  
//save colour
exports.save = (req, res) => {
    //collect the post parameters
    let params = req.body;
    //variables
    let validate_colour;
    //validate the collected data
    try {
      validate_colour = !validator.isEmpty(params.colour);
    } catch (error) {
      return res.status(400).send({
        message: "missing data to send",
      });
    }
  
    //validate that all data is true
    if (validate_colour) {
      //search if the database exists
      Colour.count({ where: { colour: params.colour } }).then((count) => {
        if (count != 0) {
          return res.status(400).send({
            message: "this colour was registered",
          });
        } else {
          const colour = {
            colour: params.colour,
            createdAt: moment().format("YYYY-MM-DD"),
            updatedAt: moment().format("YYYY-MM-DD"),
          };
  
          //save colour
          Colour.create(colour)
            .then((data) => {
              res.send({
                status: "success",
                colour: data,
              });
            })
            .catch((error) => {
              res.status(500).send({
                message: "there was an error saving the colour",
              });
            });
        }
      });
    } else {
      return res.status(400).send({
        message: "missing data to send or a data is not valid.",
      });
    }
  };


  //list all colour
exports.findAll = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  Colour.findAndCountAll({
    limit,
    offset,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((error) => {
      res.status(500).send({
        message: "An error occurred while searching for Colour",
      });
    });
};

//search colour by id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Colour.findByPk(id)
    .then((data) => {
      if (data != null) {
        res.send(data);
      } else {
        res.status(500).send({
          message: `There are no matches with the id: ${id} to search`,
        });
      }
    })
    .catch((error) => {
      res.status(500).send({
        message: "An error occurred while searching for colour",
      });
    });
};

//update colour
exports.update = (req, res) => {
  const id = req.params.id;
  let params = req.body;

  //variables
  let validate_colour;
  //validate the collected data
  try {
    validate_colour = !validator.isEmpty(params.colour);
  } catch (error) {
    return res.status(400).send({
      message: "missing data to send",
    });
  }

  if (validate_colour) {
    const colour = {
      colour: params.colour,
      updatedAt: moment().format("YYYY-MM-DD"),
    };

    Colour.update(colour, {
      where: { idcolour: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "the colour was updated successfully.",
          });
        } else {
          res.send({
            message: `Unable to update colour with id = ${id}. Maybe the colour was not found or the data sent is empty!`,
          });
        }
      })
      .catch((error) => {
        res.status(500).send({
          message: `Failed to update colour with id: ${id}.`,
        });
      });
  } else {
    return res.status(400).send({
      message: "missing data to send",
    });
  }
};

//Delete colour
exports.delete = (req, res) => {
    const id = req.params.id;
    Colour.destroy({
      where: { idcolour: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "The colour was successfully removed!",
          });
        } else {
          res.send({
            message: ` Cannot remove colour with id = ${id}. Maybe the colour was not found! `,
          });
        }
      })
      .catch(
          (error) => {
          res.status(500).send({
            message: `Could not remove colour with id ${id}`,
          });
      });
  };

