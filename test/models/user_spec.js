import {assert, expect} from 'chai';
import test_data from '../../server/test_data.js';
import {User, UserSchema} from '../../server/models/user';
import _ from 'lodash';

const availabilityEvents = [
                    {title: 'Open', start: '2016-01-22T08:00', end: '2016-01-22T18:00'}, 
                    {title: 'Open', start: '2016-01-23T08:00', end: '2016-01-23T18:00'}, 
                    {title: 'Open', start: '2016-01-24T08:00', end: '2016-01-24T18:00'},
                    {title: 'Open', start: '2016-02-22T08:00', end: '2016-02-22T18:00'}, 
                    {title: 'Open', start: '2016-03-23T08:00', end: '2016-03-23T18:00'}, 
                    {title: 'Open', start: '2016-04-24T08:00', end: '2016-04-24T18:00'}];

describe('UserSchema', () => {
	describe('subtractTimeSlots', () => {
		it('splits a time slot into 1 or 2 time slots given an appointment that intersects with it.', ()=>{

			//case 1: appointment is at the beginning of the office slot, should result in 1 
			var in_office_slot = availabilityEvents[0];
			var appointment1 = {start: '2016-01-22T08:00', end: '2016-01-22T09:00'};

			var subtraction = User.subtractTimeSlots(in_office_slot, appointment1);

			expect(subtraction.length).to.equal(1);
			assert.equal(subtraction[0].start, '2016-01-22T09:00');
			assert.equal(subtraction[0].end, '2016-01-22T18:00');

			//case 2: appointment is in middle of the office slot, should result in 2 
			var appointment2 = {start: '2016-01-22T09:00', end: '2016-01-22T10:00'};

			var subtraction = User.subtractTimeSlots(in_office_slot, appointment2);

			expect(subtraction.length).to.equal(2);
			assert.equal(subtraction[0].start, '2016-01-22T08:00');
			assert.equal(subtraction[0].end, '2016-01-22T09:00');
			assert.equal(subtraction[1].start, '2016-01-22T10:00');
			assert.equal(subtraction[1].end, '2016-01-22T18:00');

			//case 3: same as case 1, but at the end of the office slot
			var appointment3 = {start: '2016-01-22T17:00', end: '2016-01-22T18:00'};

			var subtraction = User.subtractTimeSlots(in_office_slot, appointment3);

			expect(subtraction.length).to.equal(1);
			assert.equal(subtraction[0].start, '2016-01-22T08:00');
			assert.equal(subtraction[0].end, '2016-01-22T17:00');

			//case 4: two appointments, two subtractions
			var appointment4 = {start: '2016-01-22T08:00', end: '2016-01-22T09:00'};
			var appointment5 = {start: '2016-01-22T09:00', end: '2016-01-22T10:00'};

			var subtraction1 = User.subtractTimeSlots(in_office_slot, appointment5);
			var subtraction2 = User.subtractTimeSlots(subtraction1[0], appointment4);
			var subtraction3 = User.subtractTimeSlots(subtraction1[1], appointment4);
			
			debugger;
			expect(subtraction1.length).to.equal(2);
			assert.equal(subtraction1[0].start, '2016-01-22T08:00');
			assert.equal(subtraction1[0].end, '2016-01-22T09:00');
			assert.equal(subtraction1[1].start, '2016-01-22T10:00');
			assert.equal(subtraction1[1].end, '2016-01-22T18:00');

			expect(subtraction2.length).to.equal(0);
			
			expect(subtraction3).to.equal(-1);
			
		


		});
	});

	describe('getAvailability', () => {
		it('gets aggregation of coaches in_office slots minus their appointments', ()=>{
			//debugger;

			const appointments = [
			    {client:2, coach:0, start: '2016-01-22T08:00', end: '2016-01-22T09:00', title: ''},
			    {client:2, coach:0, start: '2016-01-22T10:00', end: '2016-01-22T11:00', title: ''}
			];

			var subtraction = User.getAvailability(availabilityEvents, appointments);

			expect(subtraction.events.length).to.equal(7);
			assert.equal(subtraction.events[0].start, '2016-01-22T09:00');
			assert.equal(subtraction.events[0].end, '2016-01-22T10:00');
			assert.equal(subtraction.events[1].start, '2016-01-22T11:00');
			assert.equal(subtraction.events[1].end, '2016-01-22T18:00');

			


		});
	});	
});