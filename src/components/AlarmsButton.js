import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'react-native';
import { NavigationActions } from 'react-navigation';

const AlarmsButton = ({ goToAlarms }) => (
  <Button
    title='Go to alarms screen'
    onPress={goToAlarms}
  />
);

AlarmsButton.propTypes = {
    goToAlarms: PropTypes.func.isRequired,
};

const goToAlarmsAction = NavigationActions.navigate({ routeName: 'Alarms' });

const mapDispatchToProps = dispatch => ({
    goToAlarms: () => dispatch(goToAlarmsAction),
});

export default connect(() => ({}), mapDispatchToProps)(AlarmsButton);
