const initialAuthState = {
    alarms: []
};

function alarmsReducer(state = initialAuthState, action) {
  switch (action.type) {
    case 'INIT_ALARMS':
      return { ...state, alarms: action.payload };
    case 'ADD_ALARM':
      return { ...state, alarms: state.alarms.concat(action.payload) };
    case 'REMOVE_ALARM': {
      const deleteId = action.payload.id;
      return { ...state, alarms: state.alarms.filter(alarm => alarm.id !== deleteId) };
    }
    case 'EDIT_ALARM':
      // TODO: implement
      return { ...state };
    case 'CHANGE_ALARM_TIME': {
      const alarmIndex = state.alarms.findIndex(alarm => alarm.id === action.payload.alarm.id);
      const alarm = state.alarms[alarmIndex];

      const newTime = new Date(0);
      newTime.setHours(action.payload.newTime.hours);
      newTime.setMinutes(action.payload.newTime.minutes);

      const updatedAlarm = { ...alarm, time: newTime.getTime()};
      const alarms = state.alarms.slice();
      alarms[alarmIndex] = updatedAlarm;

      return { ...state, alarms };
    }
    case 'TOGGLE_REPEAT_DAY': {
      const alarmIndex = state.alarms.findIndex(alarm => alarm.id === action.payload.alarm.id);
      const alarm = state.alarms[alarmIndex];

      const newRepeat = alarm.repeat ? alarm.repeat : '0000000';
      newRepeat = newRepeat.split('');
      if (newRepeat[action.payload.dayIndex] === '0') {
        newRepeat[action.payload.dayIndex] = '1';
      }  else {
        newRepeat[action.payload.dayIndex] = '0';
        if (newRepeat.join('') === '0000000') {
          newRepeat = [''];
        }
      }

      const updatedAlarm = { ...alarm, repeat: newRepeat.join('') };
      const alarms = state.alarms.slice();
      alarms[alarmIndex] = updatedAlarm;

      return { ...state, alarms };
    }
    case 'TOGGLE_ALARM_REPEAT': {
      const alarmIndex = state.alarms.findIndex(alarm => alarm.id === action.payload.alarm.id);
      const alarm = state.alarms[alarmIndex];
      const updatedAlarm = { ...alarm, repeat: alarm.repeat ? '' : '1000000'};
      const alarms = state.alarms.slice();
      alarms[alarmIndex] = updatedAlarm;

      return { ...state, alarms };
    }
    case 'TOGGLE_ALARM': {
      const alarmIndex = state.alarms.findIndex(alarm => alarm.id === action.payload.id);
      const alarm = state.alarms[alarmIndex];
      const updatedAlarm = { ...alarm, isEnabled: !alarm.isEnabled};
      const alarms = state.alarms.slice();
      alarms[alarmIndex] = updatedAlarm;

      return { ...state, alarms };
    }
    default:
      return state;
  }
}

export default alarmsReducer;
