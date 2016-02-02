var _ = require('lodash');

//mock data
const bio = " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";
const colors = ['LightGreen', 'LightPink', 'LightSalmon', 'LightSeaGreen', 'green', 'blue', 'grey', 'orange', 'pink', 'teal'];
const availabilityEventsA = [
                    {title: 'Open', start: '2016-02-22T08:00', end: '2016-02-22T18:00'}, 
                    {title: 'Open', start: '2016-02-23T08:00', end: '2016-02-23T18:00'}, 
                    {title: 'Open', start: '2016-02-24T08:00', end: '2016-02-24T18:00'},
                    {title: 'Open', start: '2016-03-22T08:00', end: '2016-03-22T18:00'}, 
                    {title: 'Open', start: '2016-04-23T08:00', end: '2016-04-23T18:00'}, 
                    {title: 'Open', start: '2016-05-24T08:00', end: '2016-05-24T18:00'}];
const availabilityEventsB = [
                    {title: 'Open', start: '2016-02-15T08:00', end: '2016-02-15T18:00'}, 
                    {title: 'Open', start: '2016-02-16T08:00', end: '2016-02-16T18:00'}, 
                    {title: 'Open', start: '2016-02-17T08:00', end: '2016-02-17T18:00'},
                    {title: 'Open', start: '2016-03-18T08:00', end: '2016-03-18T18:00'}, 
                    {title: 'Open', start: '2016-04-20T08:00', end: '2016-04-20T18:00'}, 
                    {title: 'Open', start: '2016-05-30T08:00', end: '2016-05-30T18:00'}];

const usernames = ['Matt Foo', 'Molly Bar', 'Elyse Zip', 'Susan Johnson', 'Erik Red', 'Bob Newhart', 'Gayle Swenson', 'Deter Brooks', 'Richard Pitt', 'Nelson Fredrikson'];
const images = ['matthew.png', 'molly.png', 'elyse.png', 'matthew.png', 'molly.png', 'elyse.png', 'matthew.png', 'molly.png', 'elyse.png', 'matthew.png'];
const users = _.map(usernames, function(username, i){
    const events = i % 2 == 0 ? availabilityEventsA : availabilityEventsB;
    return {
        username: username,
        type: 'coach',
        password: 'pass',
        images: {medium: '/images/'+images[i]},
        in_office: {events: events, color: colors[i]}
    };
})
users.push(
    {
        username:'Joe', 
        type: 'client', 
        password: 'joe', 
        images:  {medium: '/images/matthew.png'}
    });
users.push(
    {
        username:'Bob', 
        type: 'client', 
        password: 'bob', 
        images:  {medium: '/images/matthew.png'}
    });


_.each(users, function(user) {
    if(user.type == 'coach') {
        user.bio = user.username + bio;
        user.in_office.events = user.in_office.events.map(function(event) {
            event.title = user.name;
            return event;
        });
    }
});


const coaches = _.cloneDeep(_.filter(users, function(user) {
    return user.type == 'coach';
}));
const coaches_with_ids = _.map(coaches, function(coach, i) {
    coach._id = i;
    return coach;
});
// const coaches = [];
// const coaches_with_ids = [];

module.exports = {
    users : users,
    coaches : coaches,
    coaches_with_ids : coaches_with_ids,
    colors : colors
};
