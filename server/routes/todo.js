const _ = require('lodash');
const {ObjectID} = require('mongodb');

var {Todo} = require('./../model/todo');
var {authenticate} = require('./../middleware/authenticate');

module.exports = (app) => {

  // Get All
  app.get('/todos', authenticate, (req, res) => {
    Todo.find({_creator: req.room._id}).sort('-created').limit(8).then((todos) => {
      res.send({todos});
    }, (e) => {
      res.status(400).send(e);
    });
  });

  // Get By Id
  app.get('/todo/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    Todo.findOne({
      _id: req.params.id,
      _creator: req.room._id
    }).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({todo});
    }, (e) => {
      res.status(400).send(e);
    });
  });

  // Post todo
  app.post('/todo', authenticate, (req, res) => {
    var todo = new Todo({
      subject: req.body.subject,
      body: req.body.body,
      _creator: req.room._id,
      created: new Date().getTime()
    });

    todo.save().then((doc) => {
      res.send(doc);
    }, (e) => {
      res.status(400).send(e);
    });
  });

  // Update todo
  app.patch('/todo/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['subject', 'body', 'completed']);

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null;
    }

    Todo.findOneAndUpdate({
      _id: id,
      _creator: req.room._id
    }, {
      $set: body
    }, {
      new: true
    }).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({todo});
    }, (e) => {
      res.status(400).send(e);
    })
  });

  // Delete todo
  app.delete('/todo/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
      return res.status(404).send();
    }

    Todo.findOneAndRemove({
      _id: req.params.id,
      _creator: req.room._id
    }).then((todo) => {
      if(!todo){
        return res.status(404).send();
      }
      res.send({todo});
    }, (e) => {
      res.status(400).send(e);
    });
  });
};
