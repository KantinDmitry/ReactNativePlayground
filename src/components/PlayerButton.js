import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'react-native';
import { NavigationActions } from 'react-navigation';

const PlayerButton = ({ goToPlayer }) => (
  <Button
    title='Go to player'
    onPress={goToPlayer}
  />
);

PlayerButton.propTypes = {
    goToPlayer: PropTypes.func.isRequired,
};

const goToPlayerAction = NavigationActions.navigate({ routeName: 'Player' });

const mapDispatchToProps = dispatch => ({
    goToPlayer: () => dispatch(goToPlayerAction),
});

export default connect(() => ({}), mapDispatchToProps)(PlayerButton);
