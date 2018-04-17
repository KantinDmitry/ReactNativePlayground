import React from 'react';
import { connect } from 'react-redux';
import { Text, StyleSheet, View, FlatList, Switch, Alert, TouchableHighlight } from 'react-native';
import { getAlarms, deleteAlarm, updateAlarmSwitching } from '../utils/database';

const styles = StyleSheet.create({
    alarmContainer: {
        height: 50,
        backgroundColor: '#CCCCCC',
        borderBottomWidth: 2,
        borderEndColor: '#FFFFFF',
        borderStartColor: '#000000',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    alarmsList: {
        flex: 1,
        flexDirection: 'column'
    }
});

class AlarmsScreen extends React.Component {

    renderItem({ item, index }) {
        const alarmTime = new Date(item.time);
        // FIXME: 13:0 -> 13:00
        // TODO: extract formatter
        const timeHHMM = `${alarmTime.getHours()}:${alarmTime.getMinutes()}`;

        return (
            <TouchableHighlight onLongPress={() => this.onLongPressAlarm(item)} underlayColor="white">
                <View style={styles.alarmContainer} key={index} >
                    <Text>{timeHHMM}</Text>
                    <Switch
                        value={item.isEnabled}
                        onValueChange={() => this.props.toggleAlarm(item)}
                    />
                </View>
            </TouchableHighlight>

        );
    }

    onLongPressAlarm(item) {
        Alert.alert(
            'Delete alarm',
            'Are you sure?',
            [
                {text: 'Yes', onPress: () => this.props.removeAlarm(item)},
                {text: 'Cancel', style: 'cancel'},
            ],
        );
     }

    render() {
        return (
            <FlatList
                style={styles.alarmsList}
                data={this.props.alarms}
                renderItem={this.renderItem.bind(this)}
                keyExtractor={(item, index) => 'alarmListItem' + index}
            />
        );
    }

    componentWillMount() {
        getAlarms().then(this.props.initAlarms);
    }
}

const mapStateToProps = state => ({
    alarms: state.alarmsData.alarms,
});

const mapDispatchToProps = dispatch => ({
    removeAlarm: (alarm) => {
        dispatch({ type: 'REMOVE_ALARM', payload: alarm });
        deleteAlarm(alarm);
    },
    toggleAlarm: (alarm) => {
        dispatch({ type: 'TOGGLE_ALARM', payload: alarm });
        updateAlarmSwitching({ id: alarm.id, isEnabled: !alarm.isEnabled });
    },
    initAlarms: (alarms) => dispatch({ type: 'INIT_ALARMS', payload: alarms }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AlarmsScreen);
