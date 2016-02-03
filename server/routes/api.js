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
    .exec(function(err, coaches){
        if(err) return errorHandler(err, res);
        console.log('get /coaches: sending response');
        res.send({status:'OK', coaches: coaches});
  }); 
 
});

router.get('/coach/:coachId', function(req, res) {
  var coachId = req.params.coachId;
  User
    .findById(coachId)
    //.populate('appointments.events')
    .lean()
    .exec(function(err, coach){
        console.log('/coach/:coachId =>' + coachId);
        if(err || coach == null || coach == undefined) {
          res.status(500).send({error: 'not found'});
          return;
        }
         Appointment
           .find({coach: coachId})
           .exec(function(err, appointments){
              if(err) return errorHandler(err, res);
              var availability = User.getAvailability(coach.in_office.events, appointments);
              availability.color = coach.in_office.color;
              coach.appointments.events = appointments;
              coach.availability = availability;
              res.send({status:'OK', coach: coach});
          });
  }); 
 
});

//new appointment
router.post('/appointments', function(req, res) { 
  console.log('POST to /api/appointments.'+req.body.client);

  //check for an existing appointment with this coach at the same time
  Appointment
     .findOne({coach: req.body.coach, start: req.body.start})
     .exec(function(err, appointment){
        if(err) return errorHandler(err, res);

        //if there is an appointment, send error. client can then request refresh on the coach
        if(appointment) {
          res.send({status:'ERROR', code:'COACH_UNAVAILABLE', message: 'That time slot has just been filled, please try again.'});
        } else {
          //make the appointment
          var appointment = new Appointment(req.body);
          appointment.save(function(err){
           if(err) return errorHandler(err, res);
            console.log('new appointment saved');
            res.send({status: 'OK', appointment: appointment})

          })
        }
    });
}); 

//update appointment
router.put('/appointments/:appointmentId', function(req, res) {
  var appointmentId = req.params['appointmentId'];
  console.log(`updating appointment ${appointmentId}`);

  Appointment
     .findOne({coach: req.body.coach, start: req.body.start})
     .exec(function(err, appointment){
        if(err) return errorHandler(err, res);

        //if there is an appointment, send error. client can then request refresh on the coach
        if(appointment) {
          res.send({status:'ERROR', code:'COACH_UNAVAILABLE', message: 'That time slot has just been filled, please try again.'});
        } else {
        	Appointment
            .findById(appointmentId, function(err, appointment){
              if(err) return errorHandler(err, res);
              console.log('retrieved appointment '+appointment._id);
              appointment.start = req.body.start;
              appointment.end = req.body.end;
              appointment.title = req.body.title;
              appointment.client = req.body.client;
              appointment.coach = req.body.coach;
              appointment.save(function(err){
                if(err) return errorHandler(err, res);

                console.log('appointment updated');
                res.send({status:'OK', appointment: appointment});
              })
          });
  	   }
       }); 
}); 


var errorHandler = function(err, res) {
  console.log(err);
  res.status(500).send({error: err});
  return;
}

module.exports = router;