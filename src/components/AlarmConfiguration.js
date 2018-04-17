import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  TimePickerAndroid,
  FlatList,
 } from 'react-native';
 import CheckBox from 'react-native-check-box'

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  header: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 27,
    paddingRight: 27,
    paddingBottom: 5,
    borderBottomWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  alarmTime: {
    fontSize: 26,
  },
  repeatList: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingLeft: 30,
    paddingRight: 30,
  },
  activeWD: {
    paddingBottom: 4,
    borderBottomWidth: 3,
    borderBottomColor: '#000000',
    textAlign: 'center',
  },
  inactiveWD: {
    paddingBottom: 4,
    borderBottomWidth: 3,
    borderBottomColor: '#00000000',
    color: '#CCCCCC',
    textAlign: 'center',
  },
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

  renderWeekDay(weekDay, index, alarm) {
    const style = alarm.repeat[index] === '1' ? styles.activeWD : styles.inactiveWD;

    return (
      <Text
        onPress={() => this.props.toggleRepeatDay(alarm, index)}
        style={style}
        key={index}
      >
      {
        weekDay.toUpperCase()
      }
      </Text>
    );
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
        <CheckBox
          style={{flex: 0, padding: 10, width: 130, paddingLeft: 30}}
          onClick={() => this.props.toggleRepeat(alarm)}
          isChecked={!!alarm.repeat}
          leftText={"Repeat"}
        />
        {
          !!alarm.repeat && (
            <View style={styles.repeatList}>
            {
              WEEK_DAYS.map((weekDay, index) => {
                return this.renderWeekDay(weekDay, index, alarm);
              })
            }
            </View>
          )
        }
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
  changeAlarmTime: (alarm, newTime) => dispatch({
    type: 'CHANGE_ALARM_TIME',
    payload: { alarm, newTime }
  }),
  toggleRepeatDay: (alarm, dayIndex) => dispatch({
    type: 'TOGGLE_REPEAT_DAY',
    payload: { alarm, dayIndex },
  }),
  toggleRepeat: (alarm) => dispatch({
    type: 'TOGGLE_ALARM_REPEAT',
    payload: { alarm },
  }),
});

AlarmConfiguration.propTypes = {
  navigation: PropTypes.object.isRequired,
};

AlarmConfiguration.navigationOptions = {
  title: 'Alarm configuration',
};

export default connect(mapStateToProps, mapDispatchToProps)(AlarmConfiguration);
