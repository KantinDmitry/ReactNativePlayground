const initialAuthState = {
    playlists: [],
};

function playlistsReducer(state = initialAuthState, action) {
    switch (action.type) {
    case 'INIT_PLAYLISTS':
        return { ...state, playlists: action.payload };
    case 'ADD_PLAYLIST': {
        const newPlaylist = { ...action.payload, videos: [] };
        return { ...state, playlists: state.playlists.concat(newPlaylist) };
    }
    case 'DELETE_PLAYLIST': {
        const deleteId = action.payload.id;
        return { ...state, playlists: state.playlists.filter(playlists => playlists.id !== deleteId) };
    }
    case 'ADD_VIDEO_IN_PLAYLIST': {
        const { videoInfo, playlistId } = action.payload;
        const playlistIndex = state.playlists.findIndex(playlist => playlist.id === playlistId);

        if (playlistIndex < 0) {
            return state;
        }

        const playlist = state.playlists[playlistIndex];
        const updatedPlaylist = { ...playlist, videos: playlist.videos.concat(videoInfo) };
        const playlists = Object.assign([], state.playlists, { [playlistIndex]: updatedPlaylist });

        return { ...state, playlists };
    }
    case 'REMOVE_VIDEO_FROM_PLAYLIST': {
        // TODO: implement
        const { videoInfo, playlistId } = action.payload;
        return state;
    }
    default:
        return state;
    }
}

export default playlistsReducer;
