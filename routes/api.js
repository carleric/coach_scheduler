var express = require('express');
var router = express.Router();
var User = require('../models/user.js').User;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/coaches', function(req, res) {
  User
    .find({type: 'coach'}, function(err, users){
        if(err) console.log(err);
        res.send(users);
  }); 
 
});

module.exports = router;