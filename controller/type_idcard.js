const db = require("../models");
const { pool } = require("../config/db.config");
const moment = require("moment");

const Type_idcard = db.type_idcard;
const State = db.state;
const Op = db.Sequelize.Op;

let validator = require("validator");

//paging functions
const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: type_idcard } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, data, totalPages, currentPage };
};

//save type_idcard

exports.save = (req, res) => {
  //collect the post parameters
  let params = req.body;

  //variables
  let validate_name, validate_idstate;

  //validate the collected data
  try {
    validate_name = !validator.isEmpty(params.name);
    validate_idstate = !validator.isEmpty(params.idstate);
  } catch (error) {
    return res.status(400).send({
      message: "missing data to send",
    });
  }

  //Validate that all data is true
  if (validate_name && validate_idstate) {
    //search if the database exists
    Type_idcard.count({ where: { name: params.name } }).then((count) => {
      if (count != 0) {
        return res.status(400).send({
          message: "this type idcard was registered",
        });
      } else {
        const type_idcard = {
          name: params.name.toUpperCase(),
          createdAt: moment().format("YYYY-MM-DD"),
          updatedAt: moment().format("YYYY-MM-DD"),
          fktype_idcardState: params.idstate,
        };

        //save type idcard
        Type_idcard.create(type_idcard)
          .then((data) => {
            res.send({
              status: "success",
              type_idcard: data,
            });
          })
          .catch((error) => {
            res.status(500).send({
              message: "there was an error saving the type idcard",
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

//list all type idcard
exports.findAll = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  Type_idcard.findAndCountAll({
    limit,
    offset,
    include: [
      {
        model: State,
        as: "state",
      },
    ],
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((error) => {
      res.status(500).send({
        message: "An error occurred while searching for type idcard",
      });
    });
};

//search type idcard by id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Type_idcard.findByPk(id, {
    include: [
      {
        model: State,
        as: "state",
      },
    ],
  })
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
        message: "An error occurred while searching for type idcard",
      });
    });
};

//search type idcard by name
exports.findName = (req, res) => {
  const search = req.params.search;
  Type_idcard.findAll({
    where: { name: search },
    include: [
      {
        model: State,
        as: "state",
      },
    ],
  })
    .then((data) => {
      if (data != null) {
        res.send(data);
      } else {
        res.status(500).send({
          message: `There are no matches with the name: ${search} to search`,
        });
      }
    })
    .catch((error) => {
      res.status(500).send({
        message: "An error occurred while searching for name",
      });
    });
};

//update type idcard
exports.update = (req, res) => {
  const id = req.params.id;
  let params = req.body;

  //variables
  let validate_name, validate_state;
  //validate the collected data
  try {
    validate_name = !validator.isEmpty(params.name);
    validate_state = !validator.isEmpty(params.state);
  } catch (error) {
    return res.status(400).send({
      message: "missing data to send",
    });
  }

  if (validate_name && validate_state) {
    const type_idcard = {
      name: req.params.name,
      updatedAt: moment().format("YYYY-MM-DD"),
      fktype_idcardState: req.body.state,
    };

    Type_idcard.update(type_idcard, { where: { idtype_idcard: id } })
    .then((num) => {
      if (num == 1) {
        res.status(200).send({
          message: "the idcard type has been updated successfully",
        });
      } else {
        res.status(500).send({
          message: `could not update idcard type with id: ${id}`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `error add update idcard type with id: ${id}`,
      });
    });

  } else {
    return res.status(400).send({
      message: "missing data to send",
    });
  }
};

//Delete type idcard
exports.delete = (req, res) => {
    const id = req.params.id;
    Type_idcard.destroy({
      where: { idtype_idcard: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "The type idcard was successfully removed!",
          });
        } else {
          res.send({
            message: ` Cannot remove type idcard with id = ${id}. Maybe the type idcard was not found! `,
          });
        }
      })
      .catch(
          (error) => {
          res.status(500).send({
            message: `Could not remove type idcard with id ${id}`,
          });
      });
  };