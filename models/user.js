var mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),
    	SALT_WORK_FACTOR = 10;
var _ = require('lodash');

mongoose.connect('mongodb://localhost/coach_scheduler');


var EventSchema = mongoose.Schema({
    title: String,
    start: Date,
    end: Date
});

var UserSchema = mongoose.Schema({ 
	username: { type:String, required: true, index: { unique: true }},
	type: {type:String, required:true, default:'client'},
	password: {type:String, required:true},
    bio: String,
    availability: { events: [EventSchema], color: String},
    appointments: { events: [EventSchema], color: String},
    color: String
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

//mock data
const colors = ['LightGreen', 'LightPink', 'LightSalmon', 'LightSeaGreen'];
const coaches = [
    {
        username:'Bob Foo', 
        type: 'coach', 
        password: 'foo', 
        availability: 
            {
                events: [
                    {title: 'Open', start: '2016-01-22T08:00', end: '2016-01-22T18:00'}, 
                    {title: 'Open', start: '2016-01-23T08:00', end: '2016-01-23T18:00'}, 
                    {title: 'Open', start: '2016-01-24T08:00', end: '2016-01-24T18:00'}]
            ,
            color:colors[0]}
    }, 
    {username:'John Bar', type: 'coach', password: 'bar', availability: {events: [
        {title: 'Open', start: '2016-01-23T08:00', end: '2016-01-23T18:00'}, 
        {title: 'Open', start: '2016-01-24T08:00', end: '2016-01-24T18:00'}, 
        {title: 'Open', start: '2016-01-25T08:00', end: '2016-01-25T18:00'}],
        color:colors[1]}
    }, 
    {username:'Dave Zip', type: 'coach', password: 'zip', availability: {events: [
        {title: 'Open', start: '2016-01-12T08:00', end: '2016-01-12T18:00'}, 
        {title: 'Open', start: '2016-01-13T08:00', end: '2016-01-13T18:00'}, 
        {title: 'Open', start: '2016-01-14T08:00', end: '2016-01-14T18:00'}],
        color:colors[2]}
    }
    ];

_.each(coaches, function(coach) {
 coach.bio = coach.username + " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";
 coach.availability.events = coach.availability.events.map(function(event) {
     event.title = coach.name;
     return event;
 });
});

_.each(coaches, function(coach){
    var coachModel = new User(coach);
    var removal = User.remove({username: coach.username});
    removal.then(function(err){
            coachModel.save(function(err){
                if(err) {
                    console.log(err);
                    return;
                }
                console.log('coach saved');
            });
        });
    });


module.exports.User = User;