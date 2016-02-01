var mongoose = require('mongoose');
var db = require('../db.js');
var availability = require('./availability');
var appointment = require('./appointment');
var	bcrypt = require('bcrypt');
var _ = require('lodash');
var users = require('../test_data').users;

var SALT_WORK_FACTOR = 10;

//for simplicity, coaches and clients are stored in a single collection
var UserSchema = mongoose.Schema({ 
	username: { type:String, required: true, index: { unique: true }},
	type: {type:String, required:true, default:'client'}, //coach or client
	password: {type:String, required:true},
    images: mongoose.Schema.Types.Mixed, //dictionary, like {thumb: String, small: String, medium: String, large: String} with file paths 
    bio: String, //optional, for introducint coaches to clients
    availability: { events: [availability.AvailabilitySchema], color: String}, //only exposed to coaches, not clients
    appointments: //both clients and coaches have appointments (with eachother)
        { 
            events: [ {type: mongoose.Schema.Types.ObjectId, ref:'Appointment'} ], 
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

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var User = mongoose.model('User', UserSchema);





//repopulate db with test users
_.each(users, function(user){
    console.log(`creating test user ${user.username}`);
    var removal = User.remove({username: user.username});
    removal.then(function(err){
        User.create(user, function(err, _user){
            if(err) {
                console.log(err);
                return;
            }
            console.log('user created');
        });
    })
});


module.exports.User = User;

