import React from 'react';
import { connect } from 'react-redux';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Switch,
  Alert,
  TouchableHighlight,
  Button,
} from 'react-native';
import { getAlarms, deleteAlarm } from '../utils/database';
import {
  toggleAlarm,
  createNewAlarm,
  goToConfigurationScreen,
} from '../actions/alarm';
import { msToHHMM } from '../shared/helpers/date-time';
import { WEEK_DAYS } from '../shared/constants';
import AddButton from './AddButton';

const styles = StyleSheet.create({
    root: {
      flex: 1,
      padding: 8,
      paddingBottom: 0,
    },
    alarmsList: {
        flex: 1,
    },
    alarmContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 3,
        paddingTop: 5,
        paddingBottom: 5,
        height: 50,
        borderBottomWidth: 1,
        borderColor: '#606060',
    },
    alarmTime: {
      paddingTop: 1,
      paddingRight: 7,
      paddingLeft: 4,
      borderRightWidth: 1,
      borderColor: '#CCCCCC',
      fontSize: 24,
    },
    daysList: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      paddingTop: 8,
    },
    activeWD: {
      paddingLeft: 3,
    },
    inactiveWD: {
      paddingLeft: 3,
      color: '#CCCCCC'
    },
    switch: {
      flex: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      width: 70,
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
        const timeHHMM = msToHHMM(item.time);
        const thumbTintColor = item.isEnabled ? "#FF0000" : "#F3F3F3";

        return (
            <TouchableHighlight
              onLongPress={() => this.onLongPressAlarm(item)}
              underlayColor="#999999"
              onPress={() => this.onPressAlarm(item)} >
                <View style={styles.alarmContainer} key={index} >
                    <Text style={styles.alarmTime}>{timeHHMM}</Text>
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
                    <View style={styles.switch}>
                      <Switch
                          value={item.isEnabled}
                          onTintColor="#FF000044"
                          thumbTintColor={thumbTintColor}
                          onValueChange={() => this.props.toggleAlarm(item)}
                      />
                    </View>
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
      <View style={styles.root}>
        <FlatList
            style={styles.alarmsList}
            data={this.props.alarms}
            renderItem={this.renderItem.bind(this)}
            keyExtractor={(item, index) => 'alarmListItem' + index}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 100}}
        />
        <AddButton
            onPress={() => this.props.createNewAlarm()}
        />
      </View>
    );
  }
}

AlarmsScreen.navigationOptions = {
  title: 'Alarms',
  headerTintColor: '#FF0000',
};

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
  createNewAlarm: () => dispatch(createNewAlarm()),
  goToConfigurationScreen: (alarm) => dispatch(goToConfigurationScreen(alarm)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AlarmsScreen);
