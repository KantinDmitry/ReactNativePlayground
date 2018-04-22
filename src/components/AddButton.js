import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableHighlight,
} from 'react-native';

const styles = StyleSheet.create({
    addButton: {
      flex: 0,
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      bottom: 10,
      right: 30,
      height: 70,
      width: 70,
      borderRadius: 35,
      backgroundColor: '#009DD9',
    },
});

const AddButton = ({ onPress }) => {
    return (
        <TouchableHighlight
            style={styles.addButton}
            onPress={onPress}
            underlayColor="#007099"
        >
            <View>
                <Text style={{color: '#FFFFFF', fontSize: 40, marginTop: -5}}>+</Text>
            </View>
         </TouchableHighlight>
    );
};

export default AddButton;
