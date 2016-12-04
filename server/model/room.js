var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const jws_secret = process.env.JWT_SECRET;

var RoomSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true
  },
  room_secret: {
    type: String,
    required: true,
    trim: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

RoomSchema.methods.toJSON = function () {
  var room = this;
  return _.pick(room.toObject(), ['_id', 'room']);
};

RoomSchema.methods.generateAuthToken = function () {
  var room = this;
  var access = 'auth';
  var token = jwt.sign({_id: room._id.toHexString(), access}, jws_secret).toString();

  room.tokens.push({access, token});
  return room.save().then(() => {
    return token;
  });
};

RoomSchema.methods.removeToken = function (token) {
  var room = this;

  return room.update({
    $pull: {
      tokens: {
        token: token
      }
    }
  });
};

RoomSchema.statics.findByToken = function (token) {
  var Room = this;
  var decoded;

  try {
    decoded = jwt.verify(token, jws_secret);
  } catch (e) {
    return Promise.reject();
  }

  return Room.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': decoded.access
  });
};

RoomSchema.statics.findByCredentials = function (room, room_secret) {
  var Room = this;

  return Room.findOne({room}).then((room) => {
    if (!room) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(room_secret, room.room_secret, (err, res) => {
        if (!res) {
          reject();
        } else {
          resolve(room);
        }
      });
    });
  });
};

RoomSchema.pre('save', function (next) {
  var room = this;

  if (room.isModified('room_secret')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(room.room_secret, salt, (err, hash) => {
        room.room_secret = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var Room = mongoose.model('Room', RoomSchema);

module.exports = {
  Room
};
