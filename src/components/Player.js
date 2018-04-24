import React from 'react';
import { Text, StyleSheet, View, WebView } from 'react-native';
import YouTube from 'react-native-youtube'
import { YOUTUBE_API_KEY } from '../secrets'
import { connect } from 'react-redux';
import { DEFAULT_PLAYLIST } from '../shared/constants'

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
        const currentVideoIndex = this.state.currentVideoIndex % this.state.videoIds.length;
        const videoId = this.state.videoIds[currentVideoIndex];

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
        const alarmId = this.props.navigation.state &&
            this.props.navigation.state.params &&
            this.props.navigation.state.params.alarmId;

        const alarm = this.props.alarms.find(alarm => alarm.id === alarmId) || {};
        const playlistId = alarm.playlistId || 0;
        const playlist = this.props.playlists.find(playlist => playlist.id === playlistId) || {};
        let videoIds = DEFAULT_PLAYLIST;

        if (playlist.videos && playlist.videos.length > 0) {
            videoIds = playlist.videos
                .map(video => video.id)
                .filter(Boolean);
        }


        this.setState({ currentVideoIndex: 0, videoIds });
    }
}

Player.navigationOptions = {
    title: 'Player',
    headerTintColor: '#FF0000',
};

const mapStateToProps = state => ({
    playlists: state.playlistsData.playlists || [],
    alarms: state.alarmsData.alarms,
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Player);
