import React from 'react';
import { connect } from 'react-redux';
import {
    View,
    TextInput,
    StyleSheet,
    Image,
    FlatList,
    Text,
    Button,
    Picker,
} from 'react-native';

import { addVideoToPlaylist } from '../actions/playlists';
import { YOUTUBE_API_KEY } from '../secrets'

const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    queryInput: {
        height: 60,
        paddingLeft: 15,
        paddingRight: 15,
    },
    resultsList: {
        flex: 1,
        paddingRight: 15,
        paddingLeft: 15,
        backgroundColor: '#F2F2F2',
    },
    searchResultContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingRight: 4,
        paddingLeft: 4,
        paddingBottom: 10,
        height: 80,
        borderBottomWidth: 1,
        borderColor: '#CCCCCC',
    },
    videoNameText: {
        width: '50%'
    },
    playlistPicker: {
        height: 40,
        width: 40,
        color: '#333333',
        backgroundColor: '#CCCCCCCC'
    },
    pickerText: {
      position: 'absolute',
      top: 15,
      right: 4,
      paddingTop: 6,
      paddingLeft: 4,
      height: 40,
      width: 40,
      borderRadius: 3,
      backgroundColor: '#FF0000',
      color: '#FFFFFF',
      fontSize: 18,
    },
});

class SearchScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={styles.root}>
                <TextInput
                    style={styles.queryInput}
                    onChangeText={(text) => {
                        this.setState({text});
                        this.onQueryChange(text);
                    }}
                    placeholder='Type your search query'
                    value={this.state.text}
                    returnKeyType='search'
                    underlineColorAndroid="#FF0000"
                    selectionColor="#FF0000"
                />
                <FlatList
                    style={styles.resultsList}
                    data={this.props.searchRresults}
                    renderItem={this.renderResultItem.bind(this)}
                    keyExtractor={(item, index) => 'searchResultsListItem' + index}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: 30}}
                />
            </View>
        );
    }

    renderResultItem({ item, index }) {
        return (
            <View style={styles.searchResultContainer} key={index} >
                <Image
                    style={{ height: '100%', width: '30%'}}
                    source={{ uri: item.thumbnailURL }}
                />
                <Text numberOfLines={4} style={styles.videoNameText}>
                  {item.title}
                </Text>
                <Picker
                    style={styles.playlistPicker}
                    onValueChange={(playlistId) => this.addInPlaylist(playlistId, item)}>
                    <Picker.Item label="Add to the playlist:" value="" color="#FF0000" />
                    {
                      this.props.playlists.map(
                        (playlist, index) => (<Picker.Item
                            label={`${playlist.name}`}
                            value={playlist.id}
                            key={index}
                        />)
                      )
                    }
                </Picker>
                <Text style={styles.pickerText}>Add</Text>
            </View>
        );
    }

    componentWillMount() {
        this.props.resetSearch();
    }

    addInPlaylist(playlistId, videoInfo) {
        playlistId && this.props.addVideoToPlaylist({ playlistId, videoInfo });
    }

    onQueryChange(query) {
        console.log('Search -> onQueryChange:', query);
        this.props.submitSearch(query);

        var queryParams = {
            q: query,
            maxResults: 25,
            part: 'snippet',
            key: YOUTUBE_API_KEY,
        };

        var query = Object.keys(queryParams)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
            .join('&');

        // TODO: service + actions + thunk
        fetch('https://content.googleapis.com/youtube/v3/search?' + query)
            .then(response => response.json())
            .then(formatResult)
            .then(this.props.saveResults)
            .catch(e => console.error('Search: failed to fetch results', e));
    }
}

SearchScreen.navigationOptions = {
  title: 'Search',
  headerTintColor: '#FF0000',
};

function formatResult(result) {
    return result.items.map((item) => {
        return {
            thumbnailURL: item.snippet.thumbnails.default.url,
            title: item.snippet.title,
            description: item.snippet.description,
            channelTitle: item.snippet.channelTitle,
            id: item.id.videoId
        };
    });
}

const mapStateToProps = state => ({
    searchRresults: state.searchData.results,
    playlists: state.playlistsData.playlists,
});

const mapDispatchToProps = dispatch => ({
    submitSearch: (query) => dispatch({ type: 'SUBMIT_SEARСH', payload: query }),
    resetSearch: () => dispatch({ type: 'RESET_SEARCH' }),
    saveResults: (payload) => dispatch({ type: 'SAVE_RESULTS', payload }),
    addVideoToPlaylist: (payload) => {
        dispatch(addVideoToPlaylist(payload));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
