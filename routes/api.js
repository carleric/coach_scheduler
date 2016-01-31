var express = require('express');
var router = express.Router();
var User = require('../models/user.js').User;
var Event = require('../models/user.js').Event;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/coaches', function(req, res) {
  User
    .find({type: 'coach'}, function(err, users){
        if(err) console.log(err);
        res.send(users);
  }); 
 
});

//new appointment
router.post('/user/:userId/appointments', function(req, res) {
  var userId = req.params['userId'];
  console.log('new appointment for userId=' + userId + ' body=' + req.body);
  User
    .findById(userId, function(err, user){
        if(err) console.log(err);
        var eventModel = new Event(req.body);
        user.appointments.events.push(eventModel);
        user.save(function(err){
            if(err) {
                console.log(err);
                return;
            }
            console.log('user saved new appointment');
            res.send({status: 'OK', user: user});
        });
    });
        
}); 

//new appointment
router.put('/user/:userId/appointments/:appointmentId', function(req, res) {
  var userId = req.params['userId'];
  var appointmentId = req.params['appointmentId'];
  console.log(`updating appointment ${appointmentId} for userId=${userId}`);
  User
    .findById(userId, function(err, user){
        if(err) console.log(err);
        appointment = user.appointments.events.id(appointmentId);
        
    	if(appointment == undefined) {
    		console.log('error finding appointment for update');
    		return;
    	}
		appointment.start = req.body.start;
		appointment.end = req.body.end;
        user.save(function(err){
            if(err) {
                console.log(err);
                return;
            }
            console.log('user updated appointment');
            res.send({status: 'OK', user: user});
        });
        
    });
        
}); 
 

module.exports = router;