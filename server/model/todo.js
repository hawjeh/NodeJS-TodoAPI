var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  subject: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  body: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  created: {
    type: Number,
    default: null
  }
});

module.exports = {
  Todo
};
