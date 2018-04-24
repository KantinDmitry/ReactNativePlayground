// API https://docs.expo.io/versions/latest/sdk/sqlite.html
// Data types https://www.sqlite.org/datatype3.html
// Example https://github.com/expo/sqlite-example/blob/master/App.js

const SQLite = require('react-native-sqlite-storage')

const db = SQLite.openDatabase('db.db');
const dropTables = false;

db.transaction((tx) => {
    if (dropTables) {
        tx.executeSql('drop table if exists alarms');
        tx.executeSql('drop table if exists playlists');
    }

    tx.executeSql(
        `create table if not exists alarms(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            time INTEGER,
            repeat TEXT,
            isEnabled INTEGER,
            playlistId INTEGER
        );`
    );

    tx.executeSql(
        `create table if not exists playlists(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            videos TEXT
        );`
    );
});


function makeDBCall(sql = '', args = []) {
    console.log('makeDBCall', sql, args);
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(sql, args, (_, result) => resolve(result), (err) => reject(err));
        }, reject);
    });
}

function createAlarm({ time, isEnabled, repeat, playlistId }) {
    return makeDBCall(
        'insert into alarms (time, repeat, isEnabled, playlistId) values (?, ?, ?, ?);',
        [time, repeat, +isEnabled, playlistId]
    );
}

function updateAlarmRepeat({ id, repeat }) {
    return makeDBCall(
        'update alarms set repeat = ? where id = ?;',
        [repeat, id]
    );
}

function updateAlarmSwitching({ id, isEnabled }) {
    return makeDBCall(
        'update alarms set isEnabled = ? where id = ?;',
        [+isEnabled, id]
    );
}

function updateAlarmPlaylistId({ id, playlistId }) {
    return makeDBCall(
        'update alarms set playlistId = ? where id = ?;',
        [playlistId, id]
    );
}

function updateAlarmTime({ id, time }) {
  return makeDBCall(
    'update alarms set time = ? where id = ?;',
    [+time, id]
  );
}

function deleteAlarm({ id }) {
    return makeDBCall(
        'delete from alarms where id = ?;',
        [id]
    );
}

function getAlarms() {
    return makeDBCall('select * from alarms')
        .then(({ rows }) => {
            return rows.raw().map(alarm => Object.assign(
                {},
                alarm,
                {
                    repeat: alarm.repeat,
                    isEnabled: !!alarm.isEnabled,
                }
            ));
        });
}

function createPlaylist({ name, videos }) {
    return makeDBCall(
        'insert into playlists (name, videos) values (?, ?);',
        [name, JSON.stringify(videos || [])]
    );
}

function deletePlaylist({ id }) {
    return makeDBCall(
        'delete from playlists where id = ?;',
        [id]
    );
}

function getPlaylist({ id }) {
    return makeDBCall(
        'select * from playlists where id = ?;',
        [id]
    );
}

function getPlaylists() {
    return makeDBCall('select * from playlists')
        .then(({ rows }) => {
            return rows.raw().map(playlist => ({
                ...playlist,
                videos: JSON.parse(playlist.videos) || [],
            }));
        });
}

function deleteVideoFromPlaylist({ playlistId, videoId }) {
    return getPlaylist({ id: playlistId })
        .then((result) => {
            const playlist = result.rows.item(0);

            if (playlist) {
                const videos = JSON.parse(playlist.videos || '[]');
                const updatedVideos = videos.filter(video => video.id === videoId);
                const stringifiedVideos = JSON.stringify(updatedVideos);

                return makeDBCall(
                    'update playlists set videos = ? where id = ?;',
                    [stringifiedVideos, playlistId]
                );
            } else {
                return Promise.reject(`deleteVideoFromPlaylist ${playlistId} no playlist found`);
            }
        });
}

function addVideoToPlaylist({ playlistId, videoInfo }) {
    return getPlaylist({ id: playlistId })
        .then((result) => {
            const playlist = result.rows.item(0);

            if (playlist) {
                const videos = JSON.parse(playlist.videos || '[]');
                const updatedVideos = videos.concat(videoInfo);
                const stringifiedVideos = JSON.stringify(updatedVideos);

                return makeDBCall(
                    'update playlists set videos = ? where id = ?;',
                    [stringifiedVideos, playlistId]
                );
            } else {
                return Promise.reject(`addVideoToPlaylist ${playlistId} no playlist found`);
            }
        });
}



export {
    createAlarm,
    updateAlarmRepeat,
    updateAlarmSwitching,
    updateAlarmTime,
    deleteAlarm,
    getAlarms,
    getPlaylists,
    createPlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    deleteVideoFromPlaylist,
    updateAlarmPlaylistId,
};
