"use strict";

const db = require("../models");
const { pool } = require("../config/db.config");
const moment = require("moment");

const Grade = db.grade;
const State = db.state;
const Colour = db.colour;
const User = db.user;

let validator = require("validator");

//paging functions
const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, row: grade } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, data, totalPages, currentPage };
};

// save grade
exports.save = (req, res) => {
  //collect the post parameters
  let params = req.body;

  //variables
  let validate_name, validate_state;

  //validate the collected data
  try {
    validate_name = !validator.isEmpty(params.name);
    validate_state = !validator.isEmpty(params.idstate);
  } catch (error) {
    return res.status(400).send({
      message: "missing data to send",
    });
  }

  //validate that all data is true
  if (validate_name && validate_state) {
    //search if the database exists
    Grade.count({ where: { name: params.name } }).then((count) => {
      if (count != 0) {
        return res.status(400).send({
          message: "this grade was registered",
        });
      } else {
        const grade = {
          name: params.name.charAt(0).toUpperCase() + params.name.slice(1),
          createdAt: moment().format("YYYY-MM-DD"),
          updatedAt: moment().format("YYYY-MM-DD"),
          fkgradeState: params.idstate,
        };

        //save grade
        Grade.create(grade)
          .then((data) => {
            res.send({
              status: "success",
              grade: data,
            });
          })
          .catch((error) => {
            res.status(500).send({
              message: "there was an error saving the grade",
            });
          });
      }
    });
  } else {
    return res.status(400).send({
      message: "missing data to send or data is not valid.",
    });
  }
};

//list all grade
exports.findAll = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  Grade.findAndCountAll({
    limit,
    offset,
    include: [
      {
        model: State,
        as: "state",
        attributes: {
          exclude: ["updatedAt", "createdAt", "fkcolour_idstateColour"],
        },
        include: [
          {
            model: Colour,
            as: "colour",
            attributes: {
              exclude: ["updatedAt", "createdAt"],
            },
          },
        ],
      },
    ],
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((error) => {
      res.status(500).send({
        message: "An error occurred while searching for grade",
      });
    });
};

//list grade by id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Grade.findByPk(id, {
    include: [
      {
        model: State,
        as: "state",
        attributes: {
          exclude: ["updatedAt", "createdAt", "fkcolour_idstateColour"],
        },
        include: [
          {
            model: Colour,
            as: "colour",
            attributes: {
              exclude: ["updatedAt", "createdAt"],
            },
          },
        ],
      },
    ],
  })
    .then((data) => {
      if (data != null) {
        res.status(200).send({
          message: "success",
          grade: data,
        });
      } else {
        res.status(500).send({
          message: `There are not matches with the id: ${id} to search`,
        });
      }
    })
    .catch((error) => {
      res.status(500).send({
        message: "An error occurred while searching for grade",
      });
    });
};

//Delete Grade
exports.delete = (req, res) => {
  const id = req.params.id;
  //console.log(id);
  User.count({ where: { fkuserGrade: id } })
    .then((count) => {
      if (count == 0) {
          Grade.count({ where: { idgrade: id} }).then((count) => {
              if (count != 0) {
                Grade.destroy({
                    where: {idgrade: id},
                  })
                    .then((num) => {
                      if (num == 1) {
                        res.status(200).send({
                          status: "success",
                          message: "removed",
                        });
                      } else {
                        res.status(400).send({
                          message: "Cannont remove grade",
                        });
                      }
                    })
                    .catch((error) => {
                      res.status(500).send({
                        message: `Could not remove grade`,
                      });
                    });
                
              } else {
                  return res.status(400).send(
                      {
                          message: `No Exist in the data base`
                      }
                  );
              }
          }).catch();

      } else {
        return res.status(400).send({
          message: "Not delete for used in other table",
        });
      }
    })
    .catch((error) => {
      return res.status(400).send({
        message: "error o noy exits in the data base",
      });
    });
};
