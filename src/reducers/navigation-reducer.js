import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../navigators/AppNavigator';

const firstAction = AppNavigator.router.getActionForPathAndParams('Main');
const initialState = AppNavigator.router.getStateForAction(firstAction);


function navigationReducer(state = initialState, action) {
  let nextState;

  switch (action.type) {
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}

export default navigationReducer;
