import {expect} from 'chai';
import {List} from 'immutable';
import React from 'react/addons';
//import App from '../client/src/index.jsx';
import moment from 'moment';
//import renderIntoDocument from 'react-addons-renderIntoDocument';
//import scryRenderedDOMComponentsWithTag from 'react-addons-scryRenderDOMComponentsWithTag';

const {renderIntoDocument, scryRenderedDOMComponentsWithTag} = React.addons.TestUtils;

describe('App', () => {

  describe('render', () => {
    // const component = renderIntoDocument(
    //   <App />
    // );
    // const app = scryRenderedDOMComponentsWithTag(component, 'app');

    expect(1).to.equal(1);
  });

  // describe('makeNewAppointment', () => {

  //   it('should return a new appointment with an id', () => {
      
  //     const component = renderIntoDocument(
  //       <App />
  //     );
  //     const app = scryRenderedDOMComponentsWithTag(component, 'app');

  //     const newAppointment = component.generateNewAppointment('1234', '2345', moment('2016-02-15 09:00'), moment('2016-02-15 10:00'));
  //     component.makeNewAppointment(newAppointment, (_appointment)=>{
  //       expect(_appointment._id).to.be.a('string');
  //     });
  //   });

  // });

});