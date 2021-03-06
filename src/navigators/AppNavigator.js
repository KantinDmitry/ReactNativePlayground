import React from 'react';
import PropTypes from 'prop-types';
import { BackHandler } from "react-native";
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator, NavigationActions } from 'react-navigation';

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
}, {
  cardStyle: { backgroundColor: '#FAFAFA' },
});

class AppWithNavigationState extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
  };

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    onBackPress = () => {
        const { dispatch, nav } = this.props;
        if (nav.index === 0) {
            return false;
        }

        dispatch(NavigationActions.back());
        return true;
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
