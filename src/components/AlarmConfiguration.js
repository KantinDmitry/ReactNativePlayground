import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  FlatList,
  Picker,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import DatePicker from 'react-native-datepicker'

import {
  toggleAlarm,
  changeAlarmTime,
  toggleRepeat,
  toggleRepeatDay,
} from '../actions/alarm';
import { msToHHMM } from '../shared/helpers/date-time';
import { WEEK_DAYS } from '../shared/constants';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingRight: 10,
    paddingLeft: 10,
  },
  header: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 17,
    paddingRight: 17,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: '#CCCCCC'
  },
  repeatList: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
    paddingLeft: 30,
    paddingRight: 30,
  },
  activeWD: {
    paddingBottom: 4,
    borderBottomWidth: 3,
    borderBottomColor: '#FF0000',
    color: '#FF0000',
    textAlign: 'center',
  },
  inactiveWD: {
    paddingBottom: 4,
    borderBottomWidth: 3,
    borderBottomColor: '#00000000',
    color: '#FF000044',
    textAlign: 'center',
  },
  playlistPicker: {
      color: '#333333',
  },
});

class AlarmConfiguration extends Component {

  onDateChange(date, alarm) {
    this.props.changeAlarmTime(
      alarm,
      {
        hours: +date.split(':')[0],
        minutes: +date.split(':')[1],
      }
    );
  }

  renderWeekDay(weekDay, index, alarm) {
    const style = alarm.repeat[index] === '1' ? styles.activeWD : styles.inactiveWD;

    return (
      <Text
        onPress={() => this.props.toggleRepeatDay(alarm, index)}
        style={style}
        key={index}
      >
      {
        weekDay.toUpperCase()
      }
      </Text>
    );
  }

  addInPlaylist() {
      console.log('addInPlaylist', ...args);
  }

  render() {
    const { alarm } = this.props;
    const alarmTime = new Date(alarm.time);
    const timeHHMM = msToHHMM(alarm.time);
    const thumbTintColor = alarm.isEnabled ? "#FF0000" : "#F3F3F3";

    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <DatePicker
            date={alarmTime}
            mode="time"
            androidMode="spinner"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                height: 0
              },
              dateInput: {
                borderWidth: 0,
              },
              dateText: {
                fontSize: 34,
              },
              btnTextCancel: {
                fontSize: 20,
                color: '#FF0000'
              },
              btnTextConfirm: {
                color: '#FF0000'
              }
            }}
            onDateChange={(date) => this.onDateChange(date, alarm)}
          />
          <Switch
            value={alarm.isEnabled}
            onTintColor="#FF000044"
            thumbTintColor={thumbTintColor}
            onValueChange={() => this.props.toggleAlarm(alarm)}
          />
        </View>
        <CheckBox
          style={{flex: 0, padding: 10, width: 130, paddingLeft: 30, marginTop: 10}}
          onClick={() => this.props.toggleRepeat(alarm)}
          isChecked={!!alarm.repeat}
          leftText={"Repeat"}
        />
        {
          !!alarm.repeat && (
            <View style={styles.repeatList}>
            {
              WEEK_DAYS.map((weekDay, index) => {
                return this.renderWeekDay(weekDay, index, alarm);
              })
            }
            </View>
          )
        }
          <View>
              <View><Text style={{ paddingLeft: 10 }}>Playlist</Text></View>
              <Picker
                  style={styles.playlistPicker}
                  onValueChange={(playlistId) => this.addInPlaylist(playlistId, item)}
                  prompt={'Playlist'}
                  >
                  {
                    this.props.playlists.map(
                      (playlist, index) => (
                          <Picker.Item
                              label={`${playlist.name}`}
                              value={playlist.id}
                              key={index}
                           />
                      )
                    )
                  }
              </Picker>
          </View>
      </View>
    );
  }
}

AlarmConfiguration.navigationOptions = {
  title: 'Alarm configuration',
  headerTintColor: '#FF0000',
};

const mapStateToProps = (state, ownProps) => {
  const alarmId = ownProps.navigation.state.params.alarm.id;
  return {
    alarm: state.alarmsData.alarms.find((alarm) => alarm.id === alarmId),
    playlists: state.playlistsData.playlists,
  };
};

const mapDispatchToProps = (dispatch) => ({
  toggleAlarm: (alarm) => dispatch(toggleAlarm(alarm)),
  changeAlarmTime: (alarm, newTime) => dispatch(changeAlarmTime(alarm, newTime)),
  toggleRepeat: (alarm) => dispatch(toggleRepeat(alarm)),
  toggleRepeatDay: (alarm, dayIndex) => dispatch(toggleRepeatDay(alarm, dayIndex)),
});

AlarmConfiguration.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(AlarmConfiguration);
