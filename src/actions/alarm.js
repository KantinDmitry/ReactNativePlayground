import { NavigationActions } from 'react-navigation';

import {
  updateAlarmSwitching,
  updateAlarmRepeat,
  updateAlarmTime,
  createAlarm,
} from '../utils/database';

const createNewAlarm = () => {
  return (dispatch) => {
    const alarm = {
      id: 10800000,
      time: -10800000,
      repeat: '',
      isEnabled: true,
    };

    createAlarm(alarm).then((result) => {
      const alarmWithId = { ...alarm, id: result.insertId };
      dispatch({
        type: 'ADD_ALARM',
        payload: alarmWithId,
      });
      dispatch(goToConfigurationScreen(alarmWithId));
    });
  };
};

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
    newTime = newTime.getTime();
    console.log(newTime);

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

const goToConfigurationScreen = (alarm) => {
  return (dispatch) => {
    const goToScreenAction = NavigationActions.navigate({
      routeName: 'AlarmConfiguration',
      params: { alarm },
    });

    dispatch(goToScreenAction);
  };
}

export {
  createNewAlarm,
  toggleAlarm,
  changeAlarmTime,
  toggleRepeat,
  toggleRepeatDay,
  goToConfigurationScreen,
};
