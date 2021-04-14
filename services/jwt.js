'use strict'

let jwt = require('jwt-simple');
let moment = require('moment');

exports.createToken = function(user) {
  let payload = {
      iduser: user[0].iduser,
      fname: user[0].fname,
      sname: user[0].sname,
      flastname: user[0].flastname,
      slastname: user[0].slastname,
      identification: user[0].identification,
      idState: user[0].idState,
      email: user[0].email,
      iat: moment().unix(),
      exp: moment().add(30, 'days').unix()
  };

  //console.log(payload);

  return jwt.encode(payload, 'Meeys-Colombia-2021-token-generador-Luis-C anedo');
};
