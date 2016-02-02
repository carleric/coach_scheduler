var path = require('path');
var express = require('express');
var session = require('express-session');
var webpack = require('webpack');
var config = require('../webpack.config.dev');
var compiler = webpack(config);
var api = require('./routes/api');
var passport = require('passport'), 
LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var User = require('./models/user.js').User;
var Appointment = require('./models/appointment.js').Appointment;


//express instantiation, basic web server
var app = express();


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(session({ cookie: { maxAge: 60000 }, resave: false, secret: 'cat keyboard', saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

//development middleware 
if(app.get('env') == 'development') {
	app.use(require('webpack-dev-middleware')(compiler, {
	  noInfo: true,
	  publicPath: config.output.publicPath
	}));
	app.use(require('webpack-hot-middleware')(compiler));
}

//static files
app.use(express.static('./client/public'));
app.use('/api', api);


//all requests default to the index
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'client', 'public', 'index.html'));
});


passport.use(new LocalStrategy(
  function(username, password, done) {
    
    console.log('passport LocalStrategy username='+username);
    User
      .findOne({ username: username })
      //.lean()
      //.populate('appointments.events')
      .exec(function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, 'Incorrect username.');
      }
      Appointment
           .find({client: user._id})
           .exec(function(err, appointments){
            
            user.appointments.events = appointments;
            user.comparePassword(password, function(err, isMatch) {
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
  debugger;
  console.log(`login with user=${req.body.username} pass=${req.body.password}`);
  passport.authenticate('local', function(err, user, info) {
    console.log("authenticate callback err="+err+" user="+user+" info="+info);
    if (err) { return next(err); }
    if (!user) { 
      req.logout();
      return res.send({authenticated: false});
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.send({authenticated: true, token: '8767sdjhdf', user: user});
    });
  })(req, res, next);
});

/* GET logout */
app.get('/logout', function(req, res){
  req.logout();
  res.locals.user = null;
  //res.redirect('/');
  return res.send({status: 'OK'});
});


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


module.exports = app;
