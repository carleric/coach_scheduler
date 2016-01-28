var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');
var compiler = webpack(config);
var passport = require('passport'), 
LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user.js').User;

//express instantiation, basic web server
var app = express();

//development middleware 
if(app.get('env') == 'development') {
	app.use(require('webpack-dev-middleware')(compiler, {
	  noInfo: true,
	  publicPath: config.output.publicPath
	}));
	app.use(require('webpack-hot-middleware')(compiler));
}

//static files
app.use(express.static('public'));

//all requests default to the index
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


passport.use(new LocalStrategy(
  function(username, password, done) {
    
    console.log('passport LocalStrategy username='+username);
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, 'Incorrect username.');
      }
      user.comparePassword(password, function(err, isMatch) {
        debugger;
        if (err) { 
          console.log('error='+err);
          return done(err); }
        if(isMatch) {
          console.log('authentication success');
          return done(null, user);
        } else {
          console.log('incorrect password');
          return done(null, false, 'Incorrect password.' );
        }
      });
    });
  }
));

/* POST login */
// app.post('/login', passport.authenticate('local', 
//   {   successRedirect: '/dashboard',
//       failureRedirect: '/',
//       failureFlash: true ,
//       successFlash: 'Welcome!'})
// );

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    console.log("authenticate callback err="+err+" user="+user+" info="+info);
    if (err) { return next(err); }
    if (!user) { 
      req.logout();
      req.flash('failure', ['Login failure', info]);
      return res.redirect('/login'); 
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      req.flash('success', ['Welcome', info]);
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});

/* GET logout */
app.get('/logout', function(req, res){
  req.logout();
  res.locals.user = null;
  res.redirect('/');
});
