// API https://docs.expo.io/versions/latest/sdk/sqlite.html
// Data types https://www.sqlite.org/datatype3.html
// Example https://github.com/expo/sqlite-example/blob/master/App.js

import { SQLite } from 'expo';

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
    makeDBCall(
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
            return rows._array.map(alarm => Object.assign(
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

[
    {
        time: 31800000,
        repeat: '',
        isEnabled: false,
    }, {
        time: 32000000,
        repeat: '1111100',
        isEnabled: true,
    }, {
        time: 33000000,
        repeat: '0000011',
        isEnabled: true,
    }, {
        time: 34000000,
        repeat: '0110010',
        isEnabled: false,
    }, {
        time: 35000000,
        repeat: '',
        isEnabled: true,
    }, {
        time: 36000000,
        repeat: '0110001',
        isEnabled: true,
    }
].forEach(createAlarm);
