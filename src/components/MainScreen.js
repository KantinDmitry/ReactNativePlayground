import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import TransitionButton from './TransitionButton';
import { ringAlarm } from '../actions/alarm';

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

class MainScreen extends React.Component {
    static get navigationOptions() {
        return {
            title: 'YouTube Alarm',
            headerTintColor: '#FF0000',
        }
    }

    render() {
        return (
            <View style={styles.root}>
                <View style={styles.container}>
                    <TransitionButton
                        screenName='Alarms'
                        title='Alarms list'
                    />

                    <TransitionButton
                        screenName='Playlists'
                        title='My playlists'
                    />

                    <TransitionButton
                        screenName='Player'
                        title='Open player'
                    />

                    <TransitionButton
                        screenName='Search'
                        title='Search for videos'
                    />
                </View>
            </View>
        )
    }
}

export default MainScreen;
