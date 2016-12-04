require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
const todo = require('./routes/todo');
const room = require('./routes/room');
const screen = require('./routes/screen');

var port = process.env.PORT;

var app = express();
app.use(bodyParser.json());
app.use('/public', express.static(process.cwd() + '/public'));
app.set('view engine', 'ejs');

screen(app);
todo(app);
room(app);

app.get('*', function(req, res) {
  res.status(404).send("Page not found.");
});

app.listen(port, () => {
  console.log('Server started on port', port);
});

module.exports = {
  app
};
