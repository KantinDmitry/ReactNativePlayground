import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import { addListener } from '../utils/redux';

import MainScreen from '../components/MainScreen';
import Player from '../components/Player';
import Alarms from '../components/Alarms';
import Search from '../components/Search';
import Playlists from '../components/Playlists';
import AlarmConfiguration from '../components/AlarmConfiguration';

export const AppNavigator = StackNavigator({
  Main: { screen: MainScreen },
  Player: { screen: Player },
  Alarms: { screen: Alarms },
  Search: { screen: Search },
  Playlists: { screen: Playlists },
  AlarmConfiguration: { screen: AlarmConfiguration },
});

class AppWithNavigationState extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
  };

  render() {
    const { dispatch, nav } = this.props;
    return (
      <AppNavigator
        navigation={addNavigationHelpers({
          dispatch,
          state: nav,
          addListener,
        })}/>
    );
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
