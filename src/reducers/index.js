import { combineReducers } from 'redux';

import alarmsReducer from './alarms-reducer';
import searchReducer from './search-reducer';
import navigationReducer from './navigation-reducer';

const AppReducer = combineReducers({
    nav: navigationReducer,
    alarmsData: alarmsReducer,
    searchData: searchReducer,
});

export default AppReducer;
