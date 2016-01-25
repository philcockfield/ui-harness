describe('ui-harness', function() {
  require('./ComponentHost.spec');
  require('./OutputLog.spec');
  require('./header-footer.spec');
  require('./skipped.spec');
  require('./it-server.spec');
  require('./PropTypes.spec');
});

// External libs.
require('react-atoms/specs');
require('react-object/lib/specs');



// TEMP: Load sample Relay component.
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import App from '../client/temp/components/App';
import AppHomeRoute from '../client/temp/routes/AppHomeRoute';

describe('relay', function() {
  before(() => {
    const el = <Relay.RootContainer
                  Component={App}
                  route={new AppHomeRoute()}/>

    this.load(el);
  });
});
