var {Room} = require('./../model/room');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  Room.findByToken(token).then((room) => {
    if (!room) {
      return Promise.reject();
    }

    req.room = room;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send(e);
  });
};

module.exports = {authenticate};
