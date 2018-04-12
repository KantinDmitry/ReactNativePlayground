import React from 'react';
import { StyleSheet, View } from 'react-native';

import LoginStatusMessage from './LoginStatusMessage';
import AuthButton from './AuthButton';
import TransitionButton from './TransitionButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

const MainScreen = () => (
  <View style={styles.container}>
    <LoginStatusMessage />
    <AuthButton />

    <TransitionButton
        screenName='Alarms'
        title='Go to Alarms screen'
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
);

MainScreen.navigationOptions = {
  title: 'Home Screen',
};

export default MainScreen;
