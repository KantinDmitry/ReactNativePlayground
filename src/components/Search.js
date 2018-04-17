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

import { YOUTUBE_API_KEY } from '../secrets'

const styles = StyleSheet.create({
    queryInput: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 8,
    },
    resultsList: {
        height: 600,
    },
    searchResultContainer: {
        height: 50,
        borderBottomWidth: 2,
        marginBottom: 3,
        flex: 1,
        flexDirection: 'row',
    },
    videoNameText: {
        width: '55%'
    },
    playlistPicker: {
        height: 40,
        width: '10%',
        backgroundColor: '#333',
        color: '#333',
    },
});

class SearchScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View>
                <TextInput
                    style={styles.queryInput}
                    onChangeText={(text) => {
                        this.setState({text});
                        this.onQueryChange(text);
                    }}
                    placeholder='Type your search query'
                    value={this.state.text}
                    returnKeyType='search'
                />
                <FlatList
                    style={styles.resultsList}
                    data={this.props.searchRresults}
                    renderItem={this.renderResultItem.bind(this)}
                    keyExtractor={(item, index) => 'searchResultsListItem' + index}
                />
            </View>
        );
    }

    renderResultItem({ item, index }) {
        return (
            <View style={styles.searchResultContainer} key={index} >
                <Image
                    style={{ height: '100%', width: '30%', marginRight: 4 }}
                    source={{ uri: item.thumbnailURL }}
                />
                <View style={styles.videoNameText}>
                    <Text>{item.title}</Text>
                </View>
                <Picker
                    style={styles.playlistPicker}
                    onValueChange={(playlistId) => this.addInPlaylist(playlistId, item)}>
                    <Picker.Item label="Add in the playlist" value="" />
                    {this.props.playlists.map(
                        (playlist, index) => (<Picker.Item
                            label={`${playlist.name}`}
                            value={playlist.id}
                            key={index}
                        />)
                    )}
                </Picker>
            </View>
        );
    }

    componentWillMount() {
        this.props.resetSearch();
    }

    addInPlaylist(playlistId, videoInfo) {
        playlistId && this.props.addVideoInPlaylist({ playlistId, videoInfo });
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
    addVideoInPlaylist: (payload) => dispatch({ type: 'ADD_VIDEO_IN_PLAYLIST', payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
