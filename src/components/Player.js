import React from 'react';
import { Text, StyleSheet, View, WebView } from 'react-native';
import YouTube from 'react-native-youtube'
import { YOUTUBE_API_KEY } from '../secrets'
import { connect } from 'react-redux';

const styles = StyleSheet.create({
    Player: {
        alignSelf: 'stretch',
        height: 300,
    }
});

class Player extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        const currentVideoIndex = this.state.currentVideoIndex % this.props.videos.length;
        const videoId = this.props.videos[currentVideoIndex];

        return (
            <View>
                <YouTube
                    videoId={videoId}
                    play={true}
                    fullscreen={true}
                    apiKey={YOUTUBE_API_KEY}
                    onChangeState={this.onChangeState.bind(this)}
                    style={styles.Player}
                />
            </View>
        );
    }

    onChangeState({ state }) {
        if (state === 'ended') {
            this.setState({ currentVideoIndex: this.state.currentVideoIndex + 1 });
        }
    }

    componentWillMount() {
        this.setState({ currentVideoIndex: 0 });
    }
}

Player.navigationOptions = {
    title: 'Player',
    headerTintColor: '#FF0000',
};

const mapStateToProps = state => ({
    videos: ['E86ujaO5GCM', 'FLCfCQQGAWU', 'lr5RskILpkg'],
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Player);
