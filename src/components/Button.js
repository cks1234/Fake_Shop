import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { colors } from '../constants/colors';

const Button = ({ title, iconName, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.buttonContent}>
        <Ionicons name={iconName} size={24} color="green" />
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.button, 
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5, 
    borderRadius:5,
    borderColor:'black',
    borderWidth:1,

  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'black', 
    textAlign: 'center',
    fontSize: 16,
    marginLeft: 5, 
  },
});

export default Button;
