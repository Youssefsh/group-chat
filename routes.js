module.exports = function(app) {
  app.get('/submit_nickname', function(req, res) {
    res.render('login',{title:"Group Chat"});
  });

  app.post('/new_user', function(req, res) {
    //console.log(req.body);
    tmp = {username: req.body.username,connection: 'conn'};
    users.push(tmp);
    console.log("Users: ", users);
    res.send(200, "Success");
  });

  app.get('/list_users', function(req, res) {
    res.render('user',{users: users});
  });
}