const _ = require('lodash');
const {ObjectID} = require('mongodb');

var {Room} = require('./../model/room');
var {authenticate} = require('./../middleware/authenticate');

module.exports = (app) => {
  app.post('/room', (req, res) => {
    var body = _.pick(req.body, ['room', 'room_secret']);
    var room = new Room(body);

    room.save().then(() => {
      return room.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(room);
    }).catch((e) => {
      res.status(400).send(e);
    });
  });

  app.get('/room/me', authenticate, (req, res) => {
    res.send(req.room);
  });

  app.post('/room/login', (req, res) => {
    var body = _.pick(req.body, ['room', 'room_secret']);

    Room.findByCredentials(body.room, body.room_secret).then((room) => {
      return room.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(room);
      });
    }).catch((e) => {
      res.status(400).send(e);
    });
  });

  app.delete('/room/me', authenticate, (req, res) => {
    req.room.removeToken(req.token).then(() => {
      res.status(200).send();
    }).catch((e) => {
      res.status(400).send();
    });
  });
}
