module.exports = function(app) {
  app.get('/submit_nickname', function(req, res) {
    res.render('test.html.handlebars',{test:"Hurray!"});
  });
}