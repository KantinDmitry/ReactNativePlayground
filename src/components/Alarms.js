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
        const doubleDigitsMinutes = (alarmTime.getMinutes() < 10 ? '0' : '') + alarmTime.getMinutes();
        const timeHHMM = `${alarmTime.getHours()}:${doubleDigitsMinutes}`;

        return (
            <TouchableHighlight
              onLongPress={() => this.onLongPressAlarm(item)}
              underlayColor="white"
              onPress={() => this.onPressAlarm(item)} >
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

  onPressAlarm(alarm) {
    this.props.goToConfigurationScreen(alarm);
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
  removeAlarm: (alarm) => dispatch({ type: 'REMOVE_ALARM', payload: alarm }),
  toggleAlarm: (alarm) => dispatch({ type: 'TOGGLE_ALARM', payload: alarm }),
  goToConfigurationScreen: (alarm) => {
    const goToScreenAction = NavigationActions.navigate({
      routeName: 'AlarmConfiguration',
      params: { alarm },
    });
    dispatch(goToScreenAction);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AlarmsScreen);
