var request = require('supertest')
, app = require('../server/app.js');

describe('API', function(){
	describe('GET /api/coaches', function(){
	  it('respond with json', function(done){
	    request(app)
	      .get('/api/coaches')
	      .set('Accept', 'application/json')
	      .expect('Content-Type', /json/)
	      .expect(200, done);
	  })
	})

	//undefined could be accidentally sent from cliet, expect 500
	describe('GET /api/coach/undefined', function(){
	  it('respond with json', function(done){
	    request(app)
	      .get('/api/coach/undefined')
	      .set('Accept', 'application/json')
	      .expect('Content-Type', /json/)
	      .expect(500, done);
	  })
	})

	//casting errors prevent test data, expect 500
	describe('POST /api/appointments', function(){
	  it('respond with json', function(done){
	    request(app)
	      .post('/api/appointments')
	      .send({coach: 'sldijfa', client: 'oidjfdaf', title: 'test', start: '2016-03-01-0900', end: '2016-03-01-1000'})
	      .set('Accept', 'application/json')
	      .expect('Content-Type', /json/)
	      .expect(500, done);
	  })
	})
})