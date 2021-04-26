const db = require("../models");
const { pool } = require("../config/db.config");
const moment = require("moment");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");

const User = db.user;
const Op = db.Sequelize.Op;

let validator = require("validator");

//paging functions
const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: user } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, data, totalPages, currentPage };
};

//save User

exports.save = (req, res) => {
  //collect the post parameters
  let params = req.body;

  //variables
  let validate_fname,
    validate_sname,
    validate_flastname,
    validate_slastname,
    validate_identification,
    validate_email,
    validate_password,
    validate_idState;

  //validate the collected data
  try {
    validate_fname = !validator.isEmpty(params.fname);
    validate_sname = !validator.isEmpty(params.sname);
    validate_flastname = !validator.isEmpty(params.flastname);
    validate_slastname = !validator.isEmpty(params.slastname);
    validate_identification = !validator.isEmpty(params.identification);
    validate_email =
      !validator.isEmpty(params.email) && validator.isEmail(parmas.email);
    validate_password = !validator.isEmpty(params.password);
    validate_idState = !validator.isEmpty(params.idState);
  } catch (error) {
    return res.status(400).send({
      message: "missing data to send",
    });
  }

  //Validate that all data is true
  if (
    validate_fname &&
    validate_sname &&
    validate_flastname &&
    validate_slastname &&
    validate_identification &&
    validate_email &&
    validate_password &&
    validate_idState
  ) {
    //
    User.count({
      where: { identification: params.identification },
    }).then((count) => {
      if (count != 0) {
        return res.status(400).send({
          message:
            "There is a registered user with the identification number entered",
        });
      } else {
        User.count({ where: { email: params.email } }).then((count) => {
          if (count != 0) {
            return res.status(400).send({
              message: "there is a registered email",
            });
          } else {
            //encrypt password
            bcrypt.hash(params.password, null, null, (err, hash) => {
              const password_encrypt = hash;

              const user = {
                fname: params.fname,
                sname: params.sname,
                flastname: params.flastname,
                slastname: params.slastname,
                email: params.email,
                password: params.password,
                createAt: moment().format("YYYY-MM-DD"),
                updateAt: moment().format("YYYY-MM-DD"),
                //fkUserState: params.idState,
                //fkUserIdentification: params.identification,
                //fkUserTipoDoc: params.tipodocumento,
                //fkUserCargo: params.cargo
              };
              //save user
              User.create(user)
                .then((data) => {
                  res.send({
                    status: "success",
                    user: data,
                  });
                })
                .catch((err) => {
                  res.status(500).send({
                    message:
                      err.message || "there was an error saving the user.",
                  });
                });
            });
          }
        });
      }
    });
  } else {
    return res.status().send({
      message: "missing data to send or a data is not valid.",
    });
  }
};

//user login
exports.login = (req, res) => {
  //collect the post parameters
  let params = req.body;
  //variables
  let validate_password, validate_email;

  //validate collected data
  try {
    validate_email =
      !validator.isEmpty(params.email) && !validator.isEmail(params.email);
    validate_password = !validator.isEmpty(params.password);
  } catch (error) {
    return res.status(400).send({
      message: "missing data to send",
    });
  }

  //validate that all data is true
  if (validate_email && validate_password) {
    User.count({ where: { email: params.email } }).then((count) => {
      if (count != 0) {
        //find the password saved in the database
        User.findAll({ where: { email: params.email } })
          .then((data) => {
            //check that the password matches
            bcrypt.compare(params.password, data[0].password, (err, check) => {
              if (check) {
                //generate token for login
                if (params.gettoken) {
                  //return the token
                  res.send({ token: jwt.createToken(data) });
                } else {
                  //clean the object and remove the password before returning it
                  data[0].password = undefined;

                  //return the data
                  res.send({ status: `success`, user: data });
                }
              } else {
                res.status(500).send({
                  message: `password does not match`,
                });
              }
            });
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                `an error occurred while searching for the user's mail`,
            });
          });
      } else {
        return res.status(500).send({
          message: `Unregistered user`,
        });
      }
    });
  } else {
    return res.status(400).send({
      message: "missing data to send or invalid data",
    });
  }
};

//method to update a user if it is registered
exports.update = (req, res) => {
  //collect the data
  let params = req.body;
  const id = req.user.iduser;

  //remove unnecessary properties if they are added without permission
  delete params.password;
  delete params.identification;

  //save data
  const user = {
    fname: params.fname,
    sname: params.sname,
    flastname: params.flastname,
    slastname: params.slastname,
    email: params.email,
    updateAt: moment().format("YYYY-MM-DD"),
  };

  //validate the collected data
  try {
    validate_fname = !validator.isEmpty(params.fname);
    //validate_sname = !validator.isEmpty(params.sname);
    validate_flastname = !validator.isEmpty(params.flastname);
    validate_slastname = !validator.isEmpty(params.slastname);
    //validate_identification = !validator.isEmpty(params.identification);
    validate_email =
      !validator.isEmpty(params.email) && validator.isEmail(parmas.email);
  } catch (error) {
    return res.status(400).send({
      message: "missing data to send",
    });
  }

  //Validate that all data is true
  if (
    validate_fname &&
    validate_sname &&
    validate_flastname &&
    validate_slastname &&
    validate_email
  ) {
    User.update(user, { where: { iduser: id } })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Update success",
          });
        } else {
          res.send({
            message: `Cannot update the user with id = ${id}. Maybe the Worker was not found or the data sent is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: `Error updating user with id = ${id}, error is ${err}`,
        });
      });
  } else {
    return res.status(400).send({
      message: "missing data to send or invalid data",
    });
  }
};

//list all users
exports.findAll = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  User.findAndCountAll({
    limit,
    offset,
    attributes: {
      exclude: ["password"],
    },
    include: [
      {
        model: estado,
        as: "estado",
      },
    ],
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "An error occurred while searching for users",
      });
    });
};

//search user by id
exports.findOne = (req, res) => {
  const id = req.params.id;
  User.findByPk({
    attributes: {
      exclude: ["password"],
    },
    include: [
      {
        model: estado,
        as: "estado",
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "An error occurred while searching for user",
      });
    });
};

//search by identification
exports.findIdentificacion = (req, res) => {
  const search = req.params.search;
  User.findAll({
    where: { identification: search },
    attributes: {
      exclude: ["password"],
    }
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "An error occurred while searching for users",
      });
    });
};

//search by email
exports.findEmail = (req, res) => {
  const search = req.params.search;
  User.findAll({
    where: { email: search },
    attributes: {
      exclude: ["password"],
    }
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "An error occurred while searching for users",
      });
    });
};
