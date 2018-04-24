import React from 'react';
import { Text, StyleSheet, View, WebView } from 'react-native';

const styles = StyleSheet.create({
    WebViewContainer: {
        marginTop: 20,
    }
});

export default class Player extends React.Component {
  render() {
    return (
      <View style={{ height: 300 }}>
        <WebView
            style={ styles.WebViewContainer }
            javaScriptEnabled={true}
            domStorageEnabled={true}
            source={{uri: 'https://www.youtube.com/embed/N6hVmn9FM7o' }}
          />
      </View>
    );
  }
}

Player.navigationOptions = {
  title: 'Player',
  headerTintColor: '#FF0000',
};
