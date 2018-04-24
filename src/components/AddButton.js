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
      bottom: 15,
      right: 25,
      height: 70,
      width: 70,
      borderRadius: 35,
      backgroundColor: '#FF5151',
    },
});

const AddButton = ({ onPress }) => {
    return (
        <TouchableHighlight
            style={styles.addButton}
            onPress={onPress}
            underlayColor="#FF0000"
        >
            <View>
                <Text style={{color: '#FFFFFF', fontSize: 40, marginTop: -5}}>+</Text>
            </View>
         </TouchableHighlight>
    );
};

export default AddButton;
