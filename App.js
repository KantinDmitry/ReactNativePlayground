import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import PropTypes from 'prop-types';

import AppReducer from './src/reducers';
import AppWithNavigationState from './src/navigators/AppNavigator';
import { middleware } from './src/utils/redux';
import { getAlarms, getPlaylists } from './src/utils/database';
import { ringAlarm } from './src/actions/alarm';

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

        const initAlarms = getAlarms().then((alarms) => {
            store.dispatch({ type: 'INIT_ALARMS', payload: alarms });
        });

        const initPlaylists = getPlaylists().then((playlists) => {
            store.dispatch({ type: 'INIT_PLAYLISTS', payload: playlists });
        });

        Promise.all([initAlarms, initPlaylists])
            .then(() => {
                if (props.alarmID) {
                    store.dispatch(ringAlarm(props.alarmID));
                }
            });
    }

    render() {
        return (
            <Provider store={store}>
                <AppWithNavigationState />
            </Provider>
        );
    }
}

export default ReduxExampleApp;
