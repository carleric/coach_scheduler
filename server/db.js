var mongoose = require('mongoose');

if(process.env.NODE_ENV == 'production') {
	mongoose.connect('mongodb://coach_scheduler_user:csucsu@ds055555.mongolab.com:55555/coach_scheduler');
} else {
	mongoose.connect('mongodb://localhost/coach_scheduler');
}