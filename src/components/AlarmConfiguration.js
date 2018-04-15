import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  placeholder: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

class AlarmConfiguration extends Component {
  
  
  render() {
   return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>
        Alarm Configuration Screen
      </Text>
    </View>
   );
  }
}

AlarmConfiguration.propTypes = {
};

AlarmConfiguration.navigationOptions = {
  title: 'Alarm configuration',
};

export default AlarmConfiguration;
