var express = require('express');
var router = express.Router();
var User = require('../models/user.js').User;
var Appointment = require('../models/appointment.js').Appointment;
var db = require('../db.js');
var _ = require('lodash');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/coaches', function(req, res) {

  User
    .find({type: 'coach'})
    //.lean()
    .exec(function(err, coaches){
        if(err) {console.log(err); return;}
        console.log('sending response');
        res.send({status:'OK', coaches: coaches});
  }); 
 
});

router.get('/coaches/:coachId', function(req, res) {
  var coachId = req.params.coachId;
  User
    .findById(coachId)
    //.populate('appointments.events')
    .lean()
    .exec(function(err, coach){
        if(err) {console.log(err); return;}
         Appointment
           .find({coach: coachId})
           .exec(function(err, appointments){
            var availability = User.getAvailability(coach.in_office, appointments);
            coach.appointments.events = appointments;
            coach.availability = availability;
            res.send({status:'OK', coach: coach});
          });
  }); 
 
});

//new appointment
router.post('/appointments', function(req, res) { 

  var appointment = new Appointment(req.body);
  appointment.save(function(err){
  	if(err) {console.log(err); return;}

  	console.log('new appointment saved');
  	res.send({status: 'OK', appointment: appointment})

  })

}); 

//update appointment
router.put('/appointments/:appointmentId', function(req, res) {
  var appointmentId = req.params['appointmentId'];
  console.log(`updating appointment ${appointmentId}`);

	Appointment
    .findById(appointmentId, function(err, appointment){
      if(err) {console.log(err); return;}
      console.log('retrieved appointment '+appointment._id);
      appointment.start = req.body.start;
      appointment.end = req.body.end;
      appointment.title = req.body.title;
      appointment.client = req.body.client;
      appointment.coach = req.body.coach;
      appointment.save(function(err){
        if(err) {console.log(err); return;}

        console.log('appointment updated');
        res.send({status:'OK', appointment: appointment});
      })
  });
	
        
}); 


 

module.exports = router;