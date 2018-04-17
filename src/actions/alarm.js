import { updateAlarmSwitching, updateAlarmRepeat, updateAlarmTime } from '../utils/database';

const toggleAlarm = (alarm) => {
  return (dispatch) => {
    dispatch({ type: 'TOGGLE_ALARM', payload: alarm });
    updateAlarmSwitching({ id: alarm.id, isEnabled: !alarm.isEnabled });
  };
};

const changeAlarmTime = (alarm, newTimeObj) => {
  return (dispatch) => {
    let newTime = new Date(0);
    newTime.setHours(newTimeObj.hours);
    newTime.setMinutes(newTimeObj.minutes);
    newTime = newTime.getTime()

    dispatch({ type: 'CHANGE_ALARM_TIME', payload: { alarm, newTime } });
    updateAlarmTime({ id: alarm.id, time: newTime });
  };
};

const toggleRepeat = (alarm) => {
  return (dispatch) => {
    const newRepeat = alarm.repeat ? '' : '1000000';

    dispatch({ type: 'TOGGLE_ALARM_REPEAT', payload: { alarm, newRepeat } });
    updateAlarmRepeat({ id: alarm.id, repeat: newRepeat });
  };
};

const toggleRepeatDay = (alarm, dayIndex) => {
  return (dispatch) => {
    let newRepeat = alarm.repeat ? alarm.repeat : '0000000';
    newRepeat = newRepeat.split('');
    if (newRepeat[dayIndex] === '0') {
      newRepeat[dayIndex] = '1';
    } else {
      newRepeat[dayIndex] = '0';
      if (newRepeat.join('') === '0000000') {
        newRepeat = [''];
      }
    }
    newRepeat = newRepeat.join('');

    dispatch({ type: 'TOGGLE_REPEAT_DAY', payload: { alarm, newRepeat } });
    updateAlarmRepeat({ id: alarm.id, repeat: newRepeat });
  };
};

export { toggleAlarm, changeAlarmTime, toggleRepeat, toggleRepeatDay };
