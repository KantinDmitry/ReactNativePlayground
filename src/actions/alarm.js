import { NavigationActions } from 'react-navigation';
import AppLauncher from 'react-native-app-launcher';
import moment from 'moment';

import { TIME_BUFFER } from '../shared/constants';

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

      setAlarm(alarmWithId.id, alarm.repeat, alarm.time);

      dispatch(goToConfigurationScreen(alarmWithId));
    });
  };
};

const toggleAlarm = (alarm) => {
  return (dispatch) => {
    dispatch({
      type: 'TOGGLE_ALARM',
      payload: { ...alarm, isEnabled: !alarm.isEnabled }
    });

    if (!alarm.isEnabled) {
      setAlarm(alarm.id, alarm.repeat, alarm.time);
    } else {
      clearAlarm(alarm.id, alarm.repeat);
    }

    updateAlarmSwitching({ id: alarm.id, isEnabled: !alarm.isEnabled });
  };
};

const changeAlarmTime = (alarm, newTimeObj) => {
  return (dispatch) => {
    let newTime = moment(0);
    newTime.hours(newTimeObj.hours);
    newTime.minutes(newTimeObj.minutes);
    newTime = newTime.valueOf();

    dispatch({ type: 'CHANGE_ALARM_TIME', payload: { alarm, newTime } });

    if (alarm.isEnabled) {
      setAlarm(alarm.id, alarm.repeat, newTime);
    }

    updateAlarmTime({ id: alarm.id, time: newTime });
  };
};

const toggleRepeat = (alarm) => {
  return (dispatch) => {
    const newRepeat = alarm.repeat ? '' : '1000000';

    dispatch({ type: 'TOGGLE_ALARM_REPEAT', payload: { alarm, newRepeat } });

    if (alarm.isEnabled) {
      if (newRepeat) {
        clearAlarm(alarm.id, alarm.repeat); // clear old repeat
        setAlarm(alarm.id, newRepeat, alarm.time);
      } else {
        clearAlarm(alarm.id, alarm.repeat); // clear old repeat
        setAlarm(alarm.id, newRepeat, alarm.time); // set new alarm (no repeat)
      }
    }

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

    if (alarm.isEnabled) {
      setAlarm(alarm.id, newRepeat, alarm.time);
    }

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
};

const getTimeObj = (time) => {
  const alarmTime = moment(time);
  return {
    hours: alarmTime.hours(),
    minutes: alarmTime.minutes(),
  };
};

const setAlarm = (id, repeat, time) => {
  const { hours, minutes } = getTimeObj(time);

  const now = moment();
  const fire = moment();
  fire.hours(hours);
  fire.minutes(minutes);
  fire.seconds(0);
  
  if (repeat === '') {
    console.log('clearAlarm', id);
    AppLauncher.clearAlarm(id);

    if (fire < now || fire.diff(now, 'seconds') < TIME_BUFFER) {
      AppLauncher.setAlarm(id, fire.add(1, 'day').valueOf());
      console.log('setAlarm' + ' ' + id, fire.toString());
    } else {
      AppLauncher.setAlarm(id, fire.valueOf());
      console.log('setAlarm' + ' ' + id, fire.toString());
    }
  } else {
    repeat.split('').forEach((enabled, index) => {
      const fireClone = moment(fire);
      console.log('clearAlarm', `${id}_${index}`);
      AppLauncher.clearAlarm(`${id}_${index}`);

      if (enabled === '1') {
        const todayIndex = now.isoWeekday() - 1; // Mon - 1 ... Sun - 7
        let daysDiff = index - todayIndex;
        daysDiff = (daysDiff + 7) % 7;

        if (daysDiff === 0) {
          if (fireClone < now || fireClone.diff(now, 'seconds') < TIME_BUFFER) {
            AppLauncher.setAlarm(`${id}_${index}`, fireClone.add(7, 'day').valueOf());
            console.log('setAlarm' + ' ' + `${id}_${index}`, fireClone.toString());
          } else {
            AppLauncher.setAlarm(`${id}_${index}`, fireClone.valueOf());
            console.log('setAlarm' + ' ' + `${id}_${index}`, fireClone.toString());
          }
        } else {
          AppLauncher.setAlarm(`${id}_${index}`, fireClone.add(daysDiff, 'day').valueOf());
          console.log('setAlarm' + ' ' + `${id}_${index}`, fireClone.toString());
        }
      }
    });
  }
};

const clearAlarm = (id, repeat) => {
  if (repeat === '') {
    console.log('clearAlarm', id);
    AppLauncher.clearAlarm(id);
  } else {
    repeat.split('').forEach((enabled, index) => {
      console.log('clearAlarm', `${id}_${index}`);
      AppLauncher.clearAlarm(`${id}_${index}`);
    });
  }
};

export {
  createNewAlarm,
  toggleAlarm,
  changeAlarmTime,
  toggleRepeat,
  toggleRepeatDay,
  goToConfigurationScreen,
};
