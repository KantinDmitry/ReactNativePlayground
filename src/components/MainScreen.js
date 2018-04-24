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
        )
    }

    componentDidMount() {
        const { activeAlarmId } = this.props;

        if (activeAlarmId) {
            this.props.ringAlarm(activeAlarmId);
        }
    }
}


const mapStateToProps = state => ({
    activeAlarmId: state.alarmsData.activeAlarmId,
});

const mapDispatchToProps = dispatch => ({
    ringAlarm: alarmId => dispatch(ringAlarm(alarmId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
