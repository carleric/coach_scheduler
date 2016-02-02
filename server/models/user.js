var mongoose = require('mongoose');
var moment = require('moment');
var db = require('../db.js');
var Availability = require('./availability');
var Appointment = require('./appointment').Appointment;
var	bcrypt = require('bcrypt');
var _ = require('lodash');


var SALT_WORK_FACTOR = 10;

//for simplicity, coaches and clients are stored in a single collection
var UserSchema = mongoose.Schema({ 
	username: { type:String, required: true, index: { unique: true }},
	type: {type:String, required:true, default:'client'}, //coach or client
	password: {type:String, required:true},
    images: mongoose.Schema.Types.Mixed, //dictionary, like {thumb: String, small: String, medium: String, large: String} with file paths 
    bio: String, //optional, for introducing coaches to clients
    in_office: { events: [Availability.AvailabilitySchema], color: String}, //only exposed to coaches, not clients, assume that input functions will keep this sorted chronologically
    appointments: //both clients and coaches have appointments (with eachother)
        { 
            events: [ {type: mongoose.Schema.Types.ObjectId, ref:'Appointment'} ], 
            color: String
        },
    availability: { 
            events: [ {type: mongoose.Schema.Types.Mixed} ], 
            color: String
        }
});

//user password hashing code found here: http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

// UserSchema.pre('find', function(next){
//     var user = this;

//     user.availability = user.getAvailability();

//     next();
// });

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

//in_office time slots minus scheduled appointments yields actual availability for scheduling future appointments
UserSchema.static('getAvailability', function(in_office, appointments) {

    //copy of in_office slots, to be modified in-place if an intersection is found with an appointment
    var availability = _.cloneDeep(in_office.events);

    //fetch appointments for this coach
    //Appointment.find({coach: coachJSON._id}, function(err, appointments){

        
        //check each appointment against all availability slots for intersections
        _.each(appointments, function(appointment){
            _.each(availability, function(availability_slot, index){
                var subtraction = User.subtractTimeSlots(availability_slot, appointment);
                if(subtraction != -1) {
                    debugger;
                    //modify the availability array with new availability and go to next appointment
                    //var modifiedAvailability = _.pullAt(availability, index);
                    //insert(modifiedAvailability, index, subtraction);
                    //availability = modifiedAvailability;
                    availability.splice(index, 1);
                    availability = insert(availability, index, subtraction);
                    return false; //break out of inner each loop 
                }
            });
        })

        return {events: availability, color: in_office.color};
    //})
});

  function insert (arr, index, insertObject) {
    var before = _.slice(arr, 0, index)
    var after = _.slice(arr, index)
    return _.flatten([before, insertObject, after])
  }

//if slotB occurs within slotA return array of remaining time slots from slotA
UserSchema.static('subtractTimeSlots', function(slotA, slotB) {
    if(moment(slotB.start).isSameOrAfter(slotA.start) 
        && moment(slotB.end).isSameOrBefore(slotA.end)) 
    {
        if(moment(slotB.start).isSame(slotA.start)){
            var modifiedSlotA = _.cloneDeep(slotA);
            modifiedSlotA.start = slotB.end;
            return [modifiedSlotA];
        }
        else if(moment(slotB.end).isSame(slotA.end)) {
            var modifiedSlotA = _.cloneDeep(slotA);
            modifiedSlotA.end = slotB.start;
            return [modifiedSlotA];
        } else {
            var modifiedSlotA_1 = _.cloneDeep(slotA);
            var modifiedSlotA_2 = _.cloneDeep(slotA);
            modifiedSlotA_1.end = slotB.start;
            modifiedSlotA_2.start = slotB.end;
            return [modifiedSlotA_1, modifiedSlotA_2];
        }
    } else {
        return -1;
    }
});

var User = mongoose.model('User', UserSchema);



//repopulate db with test users
// var users = require('../test_data').users;
// _.each(users, function(user){
//     console.log(`creating test user ${user.username}`);
//     var removal = User.remove({username: user.username});
//     removal.then(function(err){
//         User.create(user, function(err, _user){
//             if(err) {
//                 console.log(err);
//                 return;
//             }
//             console.log('user created');
//         });
//     })
// });


module.exports.User = User;

