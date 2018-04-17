import React from 'react';
import { connect } from 'react-redux';
import { Text, StyleSheet, View, FlatList, Alert, TouchableHighlight, Image } from 'react-native';
// import { getAlarms, deleteAlarm, updateAlarmSwitching } from '../utils/database';

const styles = StyleSheet.create({
    playlistContainer: {
        height: 120,
        backgroundColor: '#CCCCCC',
        borderBottomWidth: 2,
        flex: 1,
        flexDirection: 'column',
    },
    playlistHead: {
        height: 35,
        width: '100%',
        flex: 0,
        backgroundColor: '#BBBBBB',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    list: {
        flex: 1,
        flexDirection: 'column'
    },
    videosList: {
        flex: 1,
        flexDirection: 'row'
    }
});

class PlaylistsScreen extends React.Component {

    renderItem({ item, index }) {
        return (
            <View style={styles.playlistContainer} key={index}>
                <TouchableHighlight onLongPress={() => this.onLongPressPlaylists(item)} underlayColor="white">
                <View style={styles.playlistHead}>
                    <Text>{item.name}</Text>
                    <Text>{`${item.videos.length} videos`}</Text>
                </View>
                </TouchableHighlight>
                <FlatList
                    style={styles.videosList}
                    data={item.videos}
                    renderItem={this.renderVideoImage.bind(this)}
                    keyExtractor={(item, imageIndex) => `videoImage${index}-${imageIndex}`}
                    horizontal={true}
                />
            </View>
        );
    }

    renderVideoImage({ item, index }) {
        return (
            <Image
                style={{ height: 85, width: 90 }}
                source={{ uri: item.thumbnailURL }}
            />
        );
    }

    onLongPressPlaylists(item) {
        Alert.alert(
            'Delete playlist',
            'Are you sure?',
            [
                {text: 'Yes', onPress: () => this.props.deletePlaylist(item)},
                {text: 'Cancel', style: 'cancel'},
            ],
        );
     }

    render() {
        return (
            <FlatList
                style={styles.list}
                data={this.props.playlists}
                renderItem={this.renderItem.bind(this)}
                keyExtractor={(item, index) => 'playlistsListItem' + index}
            />
        );
    }

    componentWillMount() {

    }
}

const mapStateToProps = state => ({
    playlists: state.playlistsData.playlists,
});

const mapDispatchToProps = dispatch => ({
    deletePlaylist: (playlist) => {
        dispatch({ type: 'DELETE_PLAYLIST', payload: playlist });
    },
    initPlaylists: (playlists) => dispatch({ type: 'INIT_PLAYLISTS', payload: playlists }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistsScreen);
