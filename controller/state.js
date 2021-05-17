const db = require("../models");
const { pool } = require("../config/db.config");
const moment = require("moment");

const State = db.state;
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
  const { count: totalItems, rows: state } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, data, totalPages, currentPage };
};

//save state
exports.save = (req, res) => {
  //collect the post parameters
  let params = req.body;
  //variables
  let validate_state, validate_idcolour;
  //validate the collected data
  try {
    validate_state = !validator.isEmpty(params.name);
    validate_idcolour = !validator.isEmpty(params.idcolour);
  } catch (error) {
    return res.status(400).send({
      message: "missing data to send",
    });
  }

  //validate that all data is true
  if (validate_state && validate_idcolour) {
    //search if the database exists
    State.count({ where: { name: params.name } }).then((count) => {
      if (count != 0) {
        return res.status(400).send({
          message: "this status was registered",
        });
      } else {
        const state = {
          name: params.name,
          colour: params.colour,
          createdAt: moment().format("YYYY-MM-DD"),
          updatedAt: moment().format("YYYY-MM-DD"),
          fkcolour_idstateColour: params.idcolour,
        };

        //save state
        State.create(state)
          .then((data) => {
            res.send({
              status: "success",
              state: data,
            });
          })
          .catch((error) => {
            res.status(500).send({
              message: "there was an error saving the state",
            });
          });
      }
    });
  } else {
    return res.status().send({
      message: "missing data to send or a data is not valid.",
    });
  }
};

//list all state
exports.findAll = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  State.findAndCountAll({
    limit,
    offset,
    include: [
      {
        model: Colour,
        as: "colour",
      },
    ],
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((error) => {
      res.status(500).send({
        message: "An error occurred while searching for state",
      });
    });
};

//search state by id
exports.findOne = (req, res) => {
  const id = req.params.id;
  State.findByPk(id)
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
        message: "An error occurred while searching for state",
      });
    });
};

//search state by name
exports.findName = (req, res) => {
  const search = req.params.search;
  State.findAll({
    where: { name: search },
  })
    .then((data) => {
      if (data.length > 0) {
        res.send(data);
      } else {
        res.status(500).send({
          message: `There are no matches with the state: ${search} to search`,
        });
      }
    })
    .catch((error) => {
      res.status(500).send({
        message: "An error occurred while searching for state",
      });
    });
};

//update status
exports.update = (req, res) => {
  const id = req.params.id;
  let params = req.body;

  //variables
  let validate_state, validate_colour;
  //validate the collected data
  try {
    validate_state = !validator.isEmpty(params.name);
    validate_idcolour = !validator.isEmpty(params.idcolour);
  } catch (error) {
    return res.status(400).send({
      message: "missing data to send",
    });
  }

  if (validate_state && validate_idcolour) {
    const state = {
      name: params.name,
      updatedAt: moment().format("YYYY-MM-DD"),
      fkcolour_idstateColour: params.idcolour,
    };

    State.update(state, {
      where: { idstate: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "the status was updated successfully.",
          });
        } else {
          res.send({
            message: `Unable to update status with id = ${id}. Maybe the status was not found or the data sent is empty!`,
          });
        }
      })
      .catch((error) => {
        res.status(500).send({
          message: `Failed to update status with id: ${id}.`,
        });
      });
  } else {
    return res.status(400).send({
      message: "missing data to send",
    });
  }
};

//Delete state
exports.delete = (req, res) => {
  const id = req.params.id;
  State.destroy({
    where: { idstate: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "The state was successfully removed!",
        });
      } else {
        res.send({
          message: `
                Cannot remove state with id = $ {id}. Maybe the state was not found!`,
        });
      }
    })
    .catch((error) => {
      res.status(500).send({
        message: `Could not remove status with id ${id}`,
      });
    });
};
