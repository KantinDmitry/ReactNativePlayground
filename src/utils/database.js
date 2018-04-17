// API https://docs.expo.io/versions/latest/sdk/sqlite.html
// Data types https://www.sqlite.org/datatype3.html
// Example https://github.com/expo/sqlite-example/blob/master/App.js

import { SQLite } from 'expo';

const db = SQLite.openDatabase('db.db');

db.transaction((tx) => {
    tx.executeSql('drop table if exists alarms');
    tx.executeSql(
        'create table if not exists alarms(id REAL primary key, time INTEGER, repeat INTEGER, isEnabled INTEGER);'
    );
});

function makeDBCall(sql = '', args = []) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(sql, args, (_, result) => resolve(result), (_, err) => reject(err));
        }, reject);
    });
}

function createAlarm({ id, time, isEnabled, repeat }) {
    makeDBCall(
        'insert into alarms (id, time, repeat, isEnabled) values (?, ?, ?, ?);',
        [id, time, +repeat, +isEnabled]
    );
}

function updateAlarmRepeat({ id, repeat }) {
    return makeDBCall(
        'update alarms set repeat = ? where id = ?;',
        [+repeat, id]
    );
}

function updateAlarmSwitching({ id, isEnabled }) {
    return makeDBCall(
        'update alarms set isEnabled = ? where id = ?;',
        [+isEnabled, id]
    );
}

function deleteAlarm({ id }) {
    console.log('delete call for', id, typeof id);

    return makeDBCall(
        'delete from alarms where id = ?;',
        [id]
    ).then(console.log.bind(null, 'delete'));
}

function getAlarms() {
    return makeDBCall('select * from alarms')
        .then(({ rows }) => {
            console.log(rows._array);
            return rows._array.map(alarm => Object.assign(
                {},
                alarm,
                {
                    repeat: !!alarm.repeat,
                    isEnabled: !!alarm.isEnabled,
                }
            ));
        });
}

export {
    createAlarm,
    updateAlarmRepeat,
    updateAlarmSwitching,
    deleteAlarm,
    getAlarms,
};

// TODO: remove fake data population

[
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
].forEach(createAlarm);
