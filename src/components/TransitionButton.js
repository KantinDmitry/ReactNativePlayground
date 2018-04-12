import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'react-native';
import { NavigationActions } from 'react-navigation';

const TransitionButton = ({ screenName, title, goToScreen }) => (
  <Button
    title={title}
    onPress={() => goToScreen(screenName)}
  />
);

TransitionButton.propTypes = {
    goToScreen: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
    goToScreen: (screenName) => {
        const goToScreenAction = NavigationActions.navigate({ routeName: screenName });
        dispatch(goToScreenAction);
    },
});

export default connect(() => ({}), mapDispatchToProps)(TransitionButton);
