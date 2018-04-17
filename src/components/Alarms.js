import React from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Switch,
  Alert,
  TouchableHighlight
} from 'react-native';
import { getAlarms, deleteAlarm, updateAlarmSwitching } from '../utils/database';
import {
  toggleAlarm,
} from '../actions/alarm';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const styles = StyleSheet.create({
    alarmContainer: {
        height: 50,
        backgroundColor: '#F5F5F5',
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
    },
    daysList: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    activeWD: {
      paddingLeft: 3,
    },
    inactiveWD: {
      paddingLeft: 3,
      color: '#CCCCCC'
    },
});

class AlarmsScreen extends React.Component {

  renderWeekDay(weekDay, index, alarm) {
    const style = alarm.repeat[index] === '1' ? styles.activeWD : styles.inactiveWD;

    return (
      <Text style={style} key={index}>{weekDay}</Text>
    );
  }

    renderItem({ item, index }) {
        const alarmTime = new Date(item.time);
        const doubleDigitsMinutes = (alarmTime.getMinutes() < 10 ? '0' : '') + alarmTime.getMinutes();
        const timeHHMM = `${alarmTime.getHours()}:${doubleDigitsMinutes}`;
        return (
            <TouchableHighlight
              onLongPress={() => this.onLongPressAlarm(item)}
              underlayColor="white"
              onPress={() => this.onPressAlarm(item)} >
                <View style={styles.alarmContainer} key={index} >
                    <Text>{timeHHMM}</Text>
                    {
                      !!item.repeat && (
                        <View style={styles.daysList}>
                        {
                          WEEK_DAYS.map((weekDay, index) => {
                            return this.renderWeekDay(weekDay, index, item);
                          })
                        }
                        </View>
                      )
                    }
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

  onPressAlarm(alarm) {
    this.props.goToConfigurationScreen(alarm);
  }

  componentWillMount() {
    getAlarms().then(this.props.initAlarms);
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
}

const mapStateToProps = state => ({
    alarms: state.alarmsData.alarms,
});

const mapDispatchToProps = dispatch => ({
  initAlarms: (alarms) => dispatch({ type: 'INIT_ALARMS', payload: alarms }),
  removeAlarm: (alarm) => {
    dispatch({ type: 'REMOVE_ALARM', payload: alarm });
    deleteAlarm(alarm);
  },
  toggleAlarm: (alarm) => dispatch(toggleAlarm(alarm)),
  goToConfigurationScreen: (alarm) => {
    const goToScreenAction = NavigationActions.navigate({
      routeName: 'AlarmConfiguration',
      params: { alarm },
    });
    dispatch(goToScreenAction);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AlarmsScreen);
