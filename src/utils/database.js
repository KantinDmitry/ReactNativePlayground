// API https://docs.expo.io/versions/latest/sdk/sqlite.html
// Data types https://www.sqlite.org/datatype3.html
// Example https://github.com/expo/sqlite-example/blob/master/App.js

const SQLite = require('react-native-sqlite-storage')

const db = SQLite.openDatabase('db.db');

db.transaction((tx) => {
    tx.executeSql('drop table if exists alarms');
    tx.executeSql(
        `create table if not exists alarms(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            time INTEGER,
            repeat TEXT,
            isEnabled INTEGER
        );`
    );
});

function makeDBCall(sql = '', args = []) {
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

export {
    createAlarm,
    updateAlarmRepeat,
    updateAlarmSwitching,
    updateAlarmTime,
    deleteAlarm,
    getAlarms,
};

// TODO: remove fake data population
const prepopulatedAlarmsCount = 40;

for (let i = 0; i < prepopulatedAlarmsCount; i++) {
    const alarm = {
        time: Math.round(Math.random() * 1440) * 60000,
        repeat: ('0000000').split('').map(() => +(Math.random() > 0.5)).join(''),
        isEnabled: +(Math.random() > 0.5),
    };

    createAlarm(alarm);
};
