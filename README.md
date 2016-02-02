# coach_scheduler
web app for coordinating appointments between a coach and a client.  this is a development exercise meant to demonstrate my full stack dev capabilities.

#problem
- two types of users: clients and coaches
- clients are assigned coaches
- clients need to schedule coaching calls on a monthly basis. 
- create a web based experience that makes it easy for clients to schedule a call. 
- clients should be able to see their coach’s availability and then book hour long coaching slot. 
- once a slot is booked, other clients should not be able to book that slot with the same coach. 

#approach
- node, express, React web application.  I've used node and express along with backbone.js to create a single page web app before, but I've never used React.  Take this as an opportunity to learn React, and possibly Redux.
- If possible, put the project into a continuous integration workflow, as an opportunity to learn more about that.  As in: https://egghead.io/series/how-to-write-an-open-source-javascript-library

# to do:
- conflict detection in server when making appointment (in case where client data was stale)
- continuous integration
- redux state

#references
https://facebook.github.io/react/docs/thinking-in-react.html
http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html#unit-testing-support
https://egghead.io/series/how-to-write-an-open-source-javascript-library

