import React from 'react';
import { connect } from 'react-redux';
import {
    Text,
    StyleSheet,
    View,
    FlatList,
    Alert,
    TouchableHighlight,
    Image,
    Modal,
    TextInput,
    Button,
} from 'react-native';
import { createNewPlaylist, deletePlaylist } from '../actions/playlists';
import { getPlaylists } from '../utils/database';
import AddButton from './AddButton';

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
        flexDirection: 'row',
    },
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    modalContent: {
        flex: 0,
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        width: 300,
        height: 300,
    },
});

class PlaylistsScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            isModalVisible: false,
            newPlaylistName: '',
        };
    }

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
                {text: 'Yes', onPress: () => this.props.deletePlaylist(item.id)},
                {text: 'Cancel', style: 'cancel'},
            ],
        );
     }

     submitPlaylistName() {
         const playlistName = this.state.newPlaylistName;

         if (playlistName) {
             this.props.createNewPlaylist(playlistName);
         }

         this.closeModal();
     }

     closeModal() {
         this.setState({ newPlaylistName: '' });
         this.setModalVisibility(false);
     }

     setModalVisibility(isModalVisible) {
         this.setState({ isModalVisible })
     }

    render() {
        return (
            <View style={styles.root}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.isModalVisible}
                    onRequestClose={() => this.closeModal()}
                >
                    <View style={styles.modalContent}>
                        <Text>Enter playlist name</Text>
                        <TextInput
                            onChangeText={(newPlaylistName) => this.setState({ newPlaylistName })}
                            value={this.state.newPlaylistName}
                            style={{width: '80%'}}
                        />

                        <View style={{marginBottom: 10}}>
                            <Button
                                onPress={() => this.submitPlaylistName()}
                                title="Ok"
                            />
                        </View>
                        <Button
                            onPress={() => this.closeModal()}
                            title="Cancel"
                        />
                    </View>
                </Modal>

                <FlatList
                    style={styles.list}
                    data={this.props.playlists}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={(item, index) => 'playlistsListItem' + index}
                />
                <AddButton
                    onPress={() => this.setModalVisibility(true)}
                />
            </View>
        );
    }

    componentWillMount() {
        if (!this.props.isInitialised) {
            getPlaylists().then(this.props.initPlaylists);
        }
    }
}

const mapStateToProps = state => ({
    playlists: state.playlistsData.playlists,
    isInitialised: state.playlistsData.isInitialised,
});

const mapDispatchToProps = dispatch => ({
    deletePlaylist: (id) => {
        dispatch(deletePlaylist(id));
    },
    initPlaylists: (playlists) => dispatch({ type: 'INIT_PLAYLISTS', payload: playlists }),
    createNewPlaylist: (name) => {
        dispatch(createNewPlaylist(name));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistsScreen);
