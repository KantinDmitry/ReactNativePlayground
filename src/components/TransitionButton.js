import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'react-native';
import { NavigationActions } from 'react-navigation';

const TransitionButton = ({ screenName, title, goToScreen, screenParams }) => (
  <Button
    title={title}
    onPress={() => goToScreen(screenName, screenParams)}
  />
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
