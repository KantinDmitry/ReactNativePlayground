import React from 'react';
import { StyleSheet, View } from 'react-native';

import TransitionButton from './TransitionButton';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 180,
    backgroundColor: '#FAFAFA',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: 200,
  },
});

const MainScreen = () => (
  <View style={styles.root}>
    <View style={styles.container}>
      <TransitionButton
          screenName='Alarms'
          title='Go to Alarms screen'
      />

      <TransitionButton
          screenName='Playlists'
          title='Go to Playlists screen'
      />

      <TransitionButton
          screenName='Player'
          title='Go to Player screen'
      />

      <TransitionButton
          screenName='Search'
          title='Go to Search screen'
      />
    </View>
  </View>
);

MainScreen.navigationOptions = {
  title: 'YouTube Alarm',
  headerTintColor: '#FF0000',
};

export default MainScreen;
