import { combineReducers } from 'redux';

import alarmsReducer from './alarms-reducer';
import searchReducer from './search-reducer';
import navigationReducer from './navigation-reducer';
import playlistsReducer from './playlists-reducer';

const AppReducer = combineReducers({
    nav: navigationReducer,
    alarmsData: alarmsReducer,
    searchData: searchReducer,
    playlistsData: playlistsReducer,
});

export default AppReducer;
