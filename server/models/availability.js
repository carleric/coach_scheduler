var mongoose = require('mongoose');
var db = require('../db.js');

var AvailabilitySchema = mongoose.Schema({
    title: String,
    start: Date,
    end: Date
});
var Availability = mongoose.model('Availability', AvailabilitySchema);

module.exports.Availability = Availability;
module.exports.AvailabilitySchema = AvailabilitySchema;