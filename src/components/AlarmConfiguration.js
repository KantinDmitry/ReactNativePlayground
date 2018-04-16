import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Switch, TimePickerAndroid } from 'react-native';

const styles = StyleSheet.create({
  root: {
    height: 200,
    backgroundColor: '#F5FCFF',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 5,
    borderBottomWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  alarmTime: {
    fontSize: 26,
  }
});

class AlarmConfiguration extends Component {

  async openTimepicker(alarm, alarmTime) {
    const hours = alarmTime.getHours();
    const minutes = alarmTime.getMinutes();

    try {
      const {action, hour, minute} = await TimePickerAndroid.open({
        hour: hours,
        minute: minutes,
        is24Hour: true,
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        this.props.changeAlarmTime(
          alarm,
          {
            hours: hour,
            minutes: minute,
          }
        );
      }
    } catch ({code, message}) {
      console.warn('Cannot open time picker', message);
    }
  }

  render() {
    const { alarm } = this.props;

    const alarmTime = new Date(alarm.time);
    const doubleDigitsMinutes = (alarmTime.getMinutes() < 10 ? '0' : '') + alarmTime.getMinutes();
    const timeHHMM = `${alarmTime.getHours()}:${doubleDigitsMinutes}`;

    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <Text onPress={() => this.openTimepicker(alarm, alarmTime)} style={styles.alarmTime}>{timeHHMM}</Text>
          <Switch
            value={alarm.isEnabled}
            onValueChange={() => this.props.toggleAlarm(alarm)}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const alarmId = ownProps.navigation.state.params.alarm.id;
  return {
    alarm: state.alarmsData.alarms.find((alarm) => alarm.id === alarmId),
  };
};

const mapDispatchToProps = dispatch => ({
  toggleAlarm: (alarm) => dispatch({ type: 'TOGGLE_ALARM', payload: alarm }),
  changeAlarmTime: (alarm, newTime) => dispatch({ type: 'CHANGE_ALARM_TIME', payload: { alarm, newTime } }),
});

AlarmConfiguration.propTypes = {
  navigation: PropTypes.object.isRequired,
};

AlarmConfiguration.navigationOptions = {
  title: 'Alarm configuration',
};

export default connect(mapStateToProps, mapDispatchToProps)(AlarmConfiguration);
