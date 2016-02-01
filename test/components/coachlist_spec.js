import {expect} from 'chai';
import React from 'react/addons';
import CoachList from '../../src/components/coaches';
import test_data from '../../test_data.js';
import _ from 'lodash';

const {renderIntoDocument, scryRenderedDOMComponentsWithClass} = React.addons.TestUtils;

describe('CoachList', () => {
	describe('render', () => {
	  it('renders 2 segments, one for each coach', () => {
	    const component = renderIntoDocument(
	      <CoachList coaches={test_data.coaches_with_ids}/>
	    );

	    const segments = scryRenderedDOMComponentsWithClass(component, 'segment');
	    expect(segments.length).to.equal(2);

	  });
	});
});