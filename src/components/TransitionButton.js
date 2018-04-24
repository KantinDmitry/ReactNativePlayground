import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF0000",
    height: 60,
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    borderRadius: 3,
    padding: 15,
  }
});

const TransitionButton = ({ screenName, title, goToScreen, screenParams }) => (
  <TouchableOpacity
    activeOpacity={0.6}
    onPress={() => goToScreen(screenName, screenParams)}>
    <Text
      style={styles.button}
    >
      {title}
    </Text> 
  </TouchableOpacity>
);

TransitionButton.propTypes = {
    goToScreen: PropTypes.func.isRequired,
    screenParams: PropTypes.object,
};

TransitionButton.defaultProps = {
  screenParams: {},
};

const mapDispatchToProps = dispatch => ({
    goToScreen: (screenName, screenParams) => {
        const goToScreenAction = NavigationActions.navigate({
          routeName: screenName,
          params: screenParams,
        });
        dispatch(goToScreenAction);
    },
});

export default connect(() => ({}), mapDispatchToProps)(TransitionButton);
