import React from 'react';
import Relay from 'react-relay';
import App from '../components/App';
import AppHomeRoute from '../routes/AppHomeRoute';


describe('relay', function() {
  before(() => {
    const el = <Relay.RootContainer
                  Component={App}
                  route={new AppHomeRoute()}/>

    this.component(el);
  });
});
