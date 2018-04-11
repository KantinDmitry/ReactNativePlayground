const initialAuthState = {
    alarms: [
        {
            time: 31800000,
            repeat: false,
            isEnabled: false,
            id: 1523475409260,
        }, {
            time: 32000000,
            repeat: false,
            isEnabled: true,
            id: 1523473409260,
        }, {
            time: 33000000,
            repeat: false,
            isEnabled: true,
            id: 1524473409260,
        }, {
            time: 34000000,
            repeat: false,
            isEnabled: false,
            id: 1525473409260,
        }, {
            time: 35000000,
            repeat: false,
            isEnabled: true,
            id: 1526473409260,
        }, {
            time: 36000000,
            repeat: false,
            isEnabled: true,
            id: 1527473409260,
        }
    ]
};

function alarmsReducer(state = initialAuthState, action) {
  switch (action.type) {
    case 'ADD_ALARM':
      return { ...state, alarms: state.alarms.concat(action.payload) };
    case 'REMOVE_ALARM': {
      const deleteId = action.payload.id;
      return { ...state, alarms: state.alarms.filter(alarm => alarm.id !== deleteId) };
    }
    case 'EDIT_ALARM':
      // TODO: implement
      return { ...state };
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
