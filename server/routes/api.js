var express = require('express');
var router = express.Router();
var User = require('../models/user.js').User;
var Appointment = require('../models/appointment.js').Appointment;
var db = require('../db.js');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/coaches', function(req, res) {
  User
    .find({type: 'coach'}, function(err, coaches){
        if(err) console.log(err);
        res.send({status:'OK', coaches: coaches});
  }); 
 
});

//new appointment
router.post('/appointments', function(req, res) {
  // var userId = req.params['userId'];
  // console.log('new appointment for userId=' + userId + ' body=' + req.body);
  // User
  //   .findById(userId, function(err, user){
  //       if(err) console.log(err);
  //       var eventModel = new Event(req.body);
  //       user.appointments.events.push(eventModel);
  //       user.save(function(err){
  //           if(err) {
  //               console.log(err);
  //               return;
  //           }
  //           console.log('user saved new appointment');
  //           res.send({status: 'OK', user: user});
  //       });
  //   });
        

  var appointment = new Appointment(req.body);
  appointment.save(function(err){
  	if(err) return handleError(err);

  	console.log('new appointment saved');
  	res.send({status: 'OK', appointment: appointment})

  })

}); 

//update appointment
router.put('/appointments/:appointmentId', function(req, res) {
  // var userId = req.params['userId'];
  var appointmentId = req.params['appointmentId'];
  console.log(`updating appointment ${appointmentId}`);
  // User
  //   .findById(userId, function(err, user){
  //       if(err) console.log(err);
  //       appointment = user.appointments.events.id(appointmentId);
        
  //   	if(appointment == undefined) {
  //   		console.log('error finding appointment for update');
  //   		return;
  //   	}
		// appointment.start = req.body.start;
		// appointment.end = req.body.end;
  //       user.save(function(err){
  //           if(err) {
  //               console.log(err);
  //               return;
  //           }
  //           console.log('user updated appointment');
  //           res.send({status: 'OK', user: user});
  //       });
        
  //   });

	Appointment
    .findById(appointmentId, function(err, appointment){
      if(err) handleError(err);
      console.log('retrieved appointment '+appointment._id);
      appointment.start = req.body.start;
      appointment.end = req.body.end;
      appointment.title = req.body.title;
      appointment.client = req.body.client;
      appointment.coach = req.body.coach;
      appointment.save(function(err){
        if(err) return handleError(err);

        console.log('appointment updated');
        res.send({status:'OK', appointment: appointment});
      })
  });
	
        
}); 

var handleError = function(err) {
	console.log('!!!error: ' + err);
  //return;
}
 

module.exports = router;