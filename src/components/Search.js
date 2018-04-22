import React from 'react';
import { connect } from 'react-redux';
import { View, TextInput, StyleSheet, Image, FlatList, Text } from 'react-native';
import { YOU_TUBE_API_KEY } from '../secrets'

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
    }
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
                    renderItem={this.renderResultItem}
                    keyExtractor={(item, index) => 'searchResultsListItem' + index}
                />
            </View>
        );
    }

    renderResultItem({ item, index }) {
        return (
            <View style={styles.searchResultContainer} key={index} >
                <Image
                    style={{ height: 50, width: 90, marginRight: 4 }}
                    source={{ uri: item.thumbnailURL }}
                />
                <Text>{item.title}</Text>
            </View>
        );
    }

    componentWillMount() {
        this.props.resetSearch();
    }

    onQueryChange(query) {
        console.log('Search -> onQueryChange:', query);
        this.props.submitSearch(query);

        var queryParams = {
            q: query,
            maxResults: 25,
            part: 'snippet',
            key: YOU_TUBE_API_KEY,
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
});

const mapDispatchToProps = dispatch => ({
    submitSearch: (query) => dispatch({ type: 'SUBMIT_SEARСH', payload: query }),
    resetSearch: () => dispatch({ type: 'RESET_SEARCH' }),
    saveResults: (payload) => dispatch({ type: 'SAVE_RESULTS', payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
