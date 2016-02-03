# coach_scheduler
web app for coordinating appointments between a coach and a client.  This is a development exercise to demonstrate abilities and to learn something new.

# try it out
A demo of the app is now live [here](https://arcane-falls-25124.herokuapp.com)  Use username:Joe pass:joe, or username:Bob pass:bob

# problem
- two types of users: clients and coaches
- clients need to schedule coaching calls on a monthly basis. 
- create a web based experience that makes it easy for clients to schedule a call. 
- clients should be able to see their coach’s availability and then book hour long coaching slot. 
- once a slot is booked, other clients should not be able to book that slot with the same coach. 

# stack
- node.js / express.js: web service and API
- mongoDB : persistent storage
- mongoose.js : object data mapping
- React : front end view library

# other libraries/components
- FullCalendar : calendar component
- Passport : authentication
- SemanticUI : css look and feel
- Mocha, Chai, Supertest: unit testing

# assumptions & intentionally skipped
- Didn't implement account creation.  Just have a couple of test accounts.
- No coach interface.  It is assumed that they would have an admin page where they would set their office hours, etc.
- No enforced coach assignment (understood that client-coach relationships are meant to be somewhat fixed, but I chose to allow scheduling of any appointment with any available coach for simplicity)

# to do:
- continuous integration https://egghead.io/series/how-to-write-an-open-source-javascript-library
- Redux state
- docker deployment
- better logging (Winston or Bunyan?)
- more test coverage
- lint
- prettier login

# references
- https://facebook.github.io/react/docs/thinking-in-react.html
- http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html#unit-testing-support
- https://egghead.io/series/how-to-write-an-open-source-javascript-library
- https://christianalfoni.github.io/react-webpack-cookbook/index.html

