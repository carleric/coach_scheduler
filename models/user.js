var mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),
    	SALT_WORK_FACTOR = 10;

mongoose.connect('mongodb://localhost/appt_scheduler');



var UserSchema = mongoose.Schema({ 
	username: { type:String, required: true, index: { unique: true }},
	type: {type:String, required:true, default:'client'},
	password: {type:String, required:true}
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

module.exports.User = User;