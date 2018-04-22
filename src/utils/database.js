// API https://docs.expo.io/versions/latest/sdk/sqlite.html
// Data types https://www.sqlite.org/datatype3.html
// Example https://github.com/expo/sqlite-example/blob/master/App.js

const SQLite = require('react-native-sqlite-storage')

const db = SQLite.openDatabase('db.db');

db.transaction((tx) => {
    tx.executeSql('drop table if exists alarms');
    tx.executeSql('drop table if exists playlists');

    tx.executeSql(
        `create table if not exists alarms(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            time INTEGER,
            repeat TEXT,
            isEnabled INTEGER
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
            tx.executeSql(sql, args, (_, result) => resolve(result), (_, err) => reject(err));
        }, reject);
    });
}

function createAlarm({ time, isEnabled, repeat }) {
    return makeDBCall(
        'insert into alarms (time, repeat, isEnabled) values (?, ?, ?);',
        [time, repeat, +isEnabled]
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
};

// TODO: remove fake data population
const prepopulatedAlarmsCount = 4;

for (let i = 0; i < prepopulatedAlarmsCount; i++) {
    const alarm = {
        time: Math.round(Math.random() * 1440) * 60000,
        repeat: ('0000000').split('').map(() => +(Math.random() > 0.5)).join(''),
        isEnabled: +(Math.random() > 0.5),
    };

    createAlarm(alarm);
};

[
    {
        videos: [
            {
                "channelTitle": "toems bundy",
                "description": "lovely morning sizzla old but good enjoy :)",
                "id": "x-dTiOXXPv8",
                "thumbnailURL": "https://i.ytimg.com/vi/x-dTiOXXPv8/default.jpg",
                "title": "lovely morning - sizzla",
            },
            {
                "channelTitle": "منوعات منوعات",
                "description": "لا تنسو الاشتراك في قناتنا ليصلكم الجديد الكلمات : I'm in a good mood I'm walking down the street Don't need to be rude I am! With my bare feet Tomorrow...",
                "id": "_zZieKAwRH8",
                "thumbnailURL": "https://i.ytimg.com/vi/_zZieKAwRH8/default.jpg",
                "title": "Lovely Morning",
            },
            {
                "channelTitle": "SaberH1",
                "description": "This is the original version of \"Lovely Day\" which i decided to upload because it was not on youtube already. Please do not complain of there not being a video, as it would probably be taken...",
                "id": "sYi7uEvEEmk",
                "thumbnailURL": "https://i.ytimg.com/vi/sYi7uEvEEmk/default.jpg",
                "title": "Bill Withers - Lovely Day (Original Version)",
            },
            {
                "channelTitle": "Lounge Music",
                "description": "HAPPY Morning - Music to Wake UP ▻ PLEASE, THUMBS UP & SUBSCRIBE! ▻ https://goo.gl/EBzGGl ▻ NEW VIDEOS https://goo.gl/QcU7ry Our Music to Wake UP can be used for relaxing, calm, wake...",
                "id": "dCbufxhSVc8",
                "thumbnailURL": "https://i.ytimg.com/vi/dCbufxhSVc8/default.jpg",
                "title": "HAPPY Morning - Music to Wake UP",
            },
            {
                "channelTitle": "s sharma",
                "description": "LOVELY MORNING.",
                "id": "xbKDGLGkbCQ",
                "thumbnailURL": "https://i.ytimg.com/vi/xbKDGLGkbCQ/default.jpg",
                "title": "LOVELY MORNING",
            },
        ],
        name: 'Cheerful awakening :)',
    },
    {
        videos: [
            {
                "channelTitle": "baileykathleen2015",
                "description": "This would for sure be my favorite song! 3.",
                "id": "vH2spkJzF9k",
                "thumbnailURL": "https://i.ytimg.com/vi/vH2spkJzF9k/default.jpg",
                "title": "Kill Myself- Tim McGraw",
            },
            {
                "channelTitle": "Daphne Elzes",
                "description": "Trigger warning: contains clips of self harm and suicide. NOTE: for the ones who think I'm suicidal, I'm not. I just think that people should talk more about depressions and their thoughts,...",
                "id": "td4eZILU3yg",
                "thumbnailURL": "https://i.ytimg.com/vi/td4eZILU3yg/default.jpg",
                "title": "I tried to kill myself | Sad multifandom",
            },
            {
                "channelTitle": "Mitch S",
                "description": "Tim McGraw - Kill Myself Track # 15 Album: Live Like You Were Dying (C) 2004 Curb Records.",
                "id": "a20h93qyG0U",
                "thumbnailURL": "https://i.ytimg.com/vi/a20h93qyG0U/default.jpg",
                "title": "Tim McGraw -  Kill Myself",
            },
            {
                "channelTitle": "Rezian Nightcore",
                "description": "Nightcore - kms (Kill Myself) ▻Subscribe here for more music : https://goo.gl/C9BZVm Listen to original song :https://soundcloud.com/notmorgn/fm-kms-prod-notmorgn ➤Support notmorgn https://s...",
                "id": "gwURz7ktc1c",
                "thumbnailURL": "https://i.ytimg.com/vi/gwURz7ktc1c/default.jpg",
                "title": "Nightcore - kms (Kill Myself) || Lyrics",
            },
            {
                "channelTitle": "Liberate The People",
                "description": "วันนึงผมผิดพลาดกับสิ่งที่ผมคาดหวังไว้มากที่สุด เมื่อผลลัพธ์มันเลวร...",
                "id": "cTqmE5Go52c",
                "thumbnailURL": "https://i.ytimg.com/vi/cTqmE5Go52c/default.jpg",
                "title": "Kill Myself - Liberate P ft. Thudong (Beat Prod. VEEK)",
            },
        ],
        name: 'Hate myself on weekdays',
    },
].forEach(createPlaylist);
