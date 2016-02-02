var _ = require('lodash');

//mock data
const bio = " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";
const colors = ['LightGreen', 'LightPink', 'LightSalmon', 'LightSeaGreen'];
const availabilityEvents = [
                    {title: 'Open', start: '2016-01-22T08:00', end: '2016-01-22T18:00'}, 
                    {title: 'Open', start: '2016-01-23T08:00', end: '2016-01-23T18:00'}, 
                    {title: 'Open', start: '2016-01-24T08:00', end: '2016-01-24T18:00'},
                    {title: 'Open', start: '2016-02-22T08:00', end: '2016-02-22T18:00'}, 
                    {title: 'Open', start: '2016-03-23T08:00', end: '2016-03-23T18:00'}, 
                    {title: 'Open', start: '2016-04-24T08:00', end: '2016-04-24T18:00'}];
const users = [
    {
        username:'Matt Foo', 
        type: 'coach', 
        password: 'foo', 
        images: {medium: '/images/matthew.png'},
        in_office: {events: availabilityEvents, color: colors[0]} 
    }, 
    {
        username:'Molly Bar', 
        type: 'coach', 
        password: 'bar', 
        images:  {medium: '/images/molly.png'},
        in_office:  {events: availabilityEvents, color: colors[1]} 
        
    }, 
    {
        username:'Elyse Zip', 
        type: 'client', 
        password: 'zip', 
        images:  {medium: '/images/elyse.png'},
        in_office: {events: [], color: colors[2]},

        
    },
    {
        username:'Joe', 
        type: 'client', 
        password: 'joe', 
        images:  {medium: '/images/matthew.png'},
        in_office: {events: [], color: colors[2]}

        
    }    
];



const coaches = _.cloneDeep(_.filter(users, function(user) {
    return user.type == 'coach';
}));

_.each(users, function(user) {
    
    user.bio = user.username + bio;
    user.in_office.events = user.in_office.events.map(function(event) {
        event.title = user.name;
        return event;
    });
    
});


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
