'use strict';

module.exports = (app) => {

  app.get('/', (req, res) => {
    res.render('index');
  });

  app.get('/room', (req, res) => {
    res.render('room');
  });

}
