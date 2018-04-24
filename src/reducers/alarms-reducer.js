const initialState = {
  alarms: [],
};

function alarmsReducer(state = initialState, action) {
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

      const updatedAlarm = { ...alarm, time: action.payload.newTime };
      const alarms = state.alarms.slice();
      alarms[alarmIndex] = updatedAlarm;

      return { ...state, alarms };
    }
    case 'TOGGLE_REPEAT_DAY': {
      const alarmIndex = state.alarms.findIndex(alarm => alarm.id === action.payload.alarm.id);
      const alarm = state.alarms[alarmIndex];

      const updatedAlarm = { ...alarm, repeat: action.payload.newRepeat };
      const alarms = state.alarms.slice();
      alarms[alarmIndex] = updatedAlarm;

      return { ...state, alarms };
    }
    case 'TOGGLE_ALARM_REPEAT': {
      const alarmIndex = state.alarms.findIndex(alarm => alarm.id === action.payload.alarm.id);
      const alarm = state.alarms[alarmIndex];

      const updatedAlarm = { ...alarm, repeat: action.payload.newRepeat };
      const alarms = state.alarms.slice();
      alarms[alarmIndex] = updatedAlarm;

      return { ...state, alarms };
    }
    case 'TOGGLE_ALARM': {
      const alarmIndex = state.alarms.findIndex(alarm => alarm.id === action.payload.id);
      const alarm = state.alarms[alarmIndex];
      const updatedAlarm = { ...alarm, isEnabled: !alarm.isEnabled };
      const alarms = state.alarms.slice();
      alarms[alarmIndex] = updatedAlarm;

      return { ...state, alarms };
    }
    case 'SET_PLAYLIST_ID': {
      const alarmIndex = state.alarms.findIndex(alarm => alarm.id === action.payload.id);
      const alarm = state.alarms[alarmIndex];
      const updatedAlarm = { ...alarm, playlistId: action.payload.playlistId };
      const alarms = state.alarms.slice();
      alarms[alarmIndex] = updatedAlarm;

      return { ...state, alarms };
    }
    default:
      return state;
  }
}

export default alarmsReducer;
