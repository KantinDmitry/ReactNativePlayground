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
    root: {
        flex: 1,
        paddingTop: 8,
    },
    list: {
    },
    playlistContainer: {
        flex: 1,
    },
    playlistHead: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 20,
        paddingBottom: 20,
    },
    playlistName: {
      maxWidth: 250,
      fontSize: 18,
      lineHeight: 20,
      color: '#444444',
    },
    videosList: {
        flex: 1,
        flexDirection: 'row',
    },
    videoPreview: {
      marginLeft: 10,
      paddingLeft: 10,
      borderLeftWidth: 1,
      borderColor: '#CCCCCC',
    },
    playlistFooter: {
      marginTop: 15,
      paddingRight: 15,
      paddingLeft: 15,
    },
    delimeter: {
      borderBottomWidth: 1,
      borderColor: '#CCCCCC',
    },
    modalRoot: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
        flex: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
        height: 300,
        padding: 22,
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
    },
    modalButtons: {
      flex: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: 220,
      marginTop: 30,
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
                <TouchableHighlight onLongPress={() => this.onLongPressPlaylists(item)} underlayColor="#FF000044">
                    <View style={styles.playlistHead}>
                        <Text
                          numberOfLines={1}
                          style={styles.playlistName}>{item.name}</Text>
                        <Text>{`${item.videos.length} videos`}</Text>
                    </View>
                </TouchableHighlight>
                <FlatList
                    style={styles.videosList}
                    data={item.videos}
                    renderItem={this.renderVideoImage.bind(this)}
                    keyExtractor={(item, imageIndex) => `videoImage${index}-${imageIndex}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
                <View style={styles.playlistFooter}>
                  <View style={styles.delimeter}></View>
                </View>
            </View>
        );
    }

    renderVideoImage({ item, index }) {
        const style = index !== 0 ? styles.videoPreview : {};

        return (
          <View style={style}>
            <Image style={{height: 95, width: 120}} source={{ uri: item.thumbnailURL }} />
          </View>
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
                    transparent
                    visible={this.state.isModalVisible}
                    onRequestClose={() => this.closeModal()}
                >
                    <View style={styles.modalRoot}>
                        <View style={styles.modalContent}>
                            <Text>Enter playlist name</Text>
                            <TextInput
                                onChangeText={(newPlaylistName) => this.setState({ newPlaylistName })}
                                value={this.state.newPlaylistName}
                                style={{width: '80%'}}
                                underlineColorAndroid="#FF0000"
                                selectionColor="#FF0000"
                            />

                            <View style={styles.modalButtons}>
                                <Button
                                    color="#FF0000"
                                    onPress={() => this.submitPlaylistName()}
                                    title="Create"
                                />
                                <Button
                                    color="#FF0000"
                                    onPress={() => this.closeModal()}
                                    title="Cancel"
                                />
                            </View>
                        </View>
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

PlaylistsScreen.navigationOptions = {
  title: 'Playlists',
  headerTintColor: '#FF0000',
};

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
