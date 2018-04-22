import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import PropTypes from 'prop-types';

import AppReducer from './src/reducers';
import AppWithNavigationState from './src/navigators/AppNavigator';
import { middleware } from './src/utils/redux';

const store = createStore(
  AppReducer,
  applyMiddleware(thunk, middleware),
);

class ReduxExampleApp extends React.Component {
  static propTypes = {
    // the id of the alarm responsible for the launch is injected as a prop
    // (react-native-app-launcher)
    alarmID: PropTypes.string,
  }

  constructor(props) {
    super(props);
    console.log('App.js', props);
  }

  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('ReduxExample', () => ReduxExampleApp);

export default ReduxExampleApp;
