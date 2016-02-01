var mongoose = require('mongoose');
var db = require('../db.js');

var AppointmentSchema = mongoose.Schema({
    title: String,
    start: Date,
    end: Date,
    client: {type: mongoose.Schema.Types.ObjectId, required:true, ref: 'User'},
    coach: {type: mongoose.Schema.Types.ObjectId, required:true, ref: 'User'}
});
var Appointment = mongoose.model('Appointment', AppointmentSchema);


module.exports.Appointment = Appointment;
module.exports.AppointmentSchema = AppointmentSchema;

