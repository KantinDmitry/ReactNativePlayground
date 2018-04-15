import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Switch } from 'react-native';

const styles = StyleSheet.create({
  root: {
    height: 200,
    backgroundColor: '#F5FCFF',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 5,
    borderBottomWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  alarmTime: {
    fontSize: 26,
  }
});

class AlarmConfiguration extends Component {

  render() {
    const { alarm } = this.props;

    const alarmTime = new Date(alarm.time);
    const timeHHMM = `${alarmTime.getHours()}:${alarmTime.getMinutes()}`;

    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <Text style={styles.alarmTime}>{timeHHMM}</Text>
          <Switch
            value={alarm.isEnabled}
            onValueChange={() => this.props.toggleAlarm(alarm)}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const alarmId = ownProps.navigation.state.params.alarm.id;
  return {
    alarm: state.alarmsData.alarms.find((alarm) => alarm.id === alarmId),
  };
};

const mapDispatchToProps = dispatch => ({
  toggleAlarm: (alarm) => dispatch({ type: 'TOGGLE_ALARM', payload: alarm }),
});

AlarmConfiguration.propTypes = {
  navigation: PropTypes.object.isRequired,
};

AlarmConfiguration.navigationOptions = {
  title: 'Alarm configuration',
};

export default connect(mapStateToProps, mapDispatchToProps)(AlarmConfiguration);
