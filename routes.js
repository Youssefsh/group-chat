module.exports = function(app) {
  app.get('/submit_nickname', function(req, res) {
    res.send('Nickname Submission Form goes here.')
  });

  app.get('/home', function(req, res) {
    res.render('index');
  });

}