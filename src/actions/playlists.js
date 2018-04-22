import {
    createPlaylist,
    deletePlaylist as deletePlaylistFromDB,
    addVideoToPlaylist as addVideoToPlaylistInDB,
    deleteVideoFromPlaylist as deleteVideoFromPlaylistInDB,
} from '../utils/database';

const createNewPlaylist = (name, videos = []) => {
  return (dispatch) => {
    createPlaylist({ name }).then((result) => {
      const playlistWithId = { name, id: result.insertId, videos };

      dispatch({
        type: 'ADD_PLAYLIST',
        payload: playlistWithId,
      });
    });
  };
};

const deletePlaylist = (id) => {
  return (dispatch) => {
    deletePlaylistFromDB({ id }).then(() => {
      dispatch({
        type: 'DELETE_PLAYLIST',
        payload: { id },
      });
    });
  };
};

const addVideoToPlaylist = ({ playlistId, videoInfo }) => {
  return (dispatch) => {
    addVideoToPlaylistInDB({ playlistId, videoInfo }).then(() => {
      dispatch({
        type: 'ADD_VIDEO_IN_PLAYLIST',
        payload: { playlistId, videoInfo },
      });
    });
  };
};

const deleteVideoFromPlaylist = ({ playlistId, videoId }) => {
    // TODO: implement
  return (dispatch) => {
    deleteVideoFromPlaylistInDB({ playlistId, videoId }).then(() => {
      dispatch({
        type: 'ADD_VIDEO_IN_PLAYLIST',
        payload: { playlistId, videoId },
      });
    });
  };
};

export {
    createNewPlaylist,
    deletePlaylist,
    addVideoToPlaylist,
 };
