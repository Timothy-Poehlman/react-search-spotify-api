import React from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import App from '../components/App';
import beatlesData from './fixtures/beatles.js';
import Profile from '../components/Profile';
import Spotify from '../spotify';
//import helper from './helpers/helper';

describe('App', () => {
  it('should display Music Master', () => {
    const wrapper = shallow(<App/>);
    expect(wrapper.text()).to.match(/Music Master/);
  });

  it('renders tag: #Gallery', () => {
    const wrapper = shallow(<App/>);
    expect(wrapper.find('#Gallery')).to.have.length(1);
  });

  it('renders tag: #Profile', () => {
    const wrapper = shallow(<App/>);
    expect(wrapper.find('#Profile')).to.have.length(1);
  });

  it('renders Profile component', () => {
    const wrapper = shallow(<App/>);
    expect(wrapper.find(Profile).length).to.equal(1);
  });
  
  it('has state: query, with initial value: ""', () => {
    const wrapper = mount(<App/>);
    expect(wrapper.state().query).to.equal("");
  });

  it('has state: artist, with initial value: null', () => {
    const wrapper = mount(<App/>);
    expect(wrapper.state().artist).to.equal(null);
  });

  describe('behavior', () => {
    let wrapper, button, search;
    
    beforeEach(() => {
      wrapper = mount(<App/>);
      button  = wrapper.find('button');
      search  = Spotify.search;
    });

    it('clicking the search button calls the search() function on Spotify API', () => {
      button.simulate('click');
      expect(search.calledOnce);
    });

    it('clicking the search button calls the search() function on Spotify API', () => {
      const input = wrapper.find('input');
      input.simulate('keyDown', { key: 'Enter' });
      expect(search.calledOnce);
    })

    describe('API', () => {
      let wrapper, beatles;
      
      beforeEach(() => {
        wrapper = mount(<App/>);
        global.fetch = jest.fn().mockImplementation(() => {
          return new Promise((resolve, reject) => {
            resolve({
              'ok': true, 
              'status': 200, 
              json: function() {
                return beatlesData
              }
            });
          });
        });
        wrapper.setState({query: 'The Beatles'});
        beatles = beatlesData.artists.items[0];       
      });

      it('search() makes a request to the spotify API to get artist data', async () => {
        const response = await wrapper.instance().search();
        expect(response.artists.items[0]).to.equal(beatles);
      });

      it('search() calls the updateProfile() function', async () => {
        const updateProfile = sinon.spy(wrapper.instance(), 'updateProfile');
        const response = await wrapper.instance().search();
        expect(updateProfile.calledOnce).to.equal(true);
      });

      it('searching for an artist renders the profile for that Artist', async () => {
        const response = await wrapper.instance().search();
        expect(wrapper.find(Profile).props().artist).to.equal(beatles);
      });
      
    });

    

  });
});