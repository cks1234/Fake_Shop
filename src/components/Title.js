import React from 'react';
import { Text, StyleSheet } from 'react-native';

const Title = ({ children }) => {
  return <Text style={styles.title}>{children}</Text>;
};

const styles = StyleSheet.create({
  title: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    borderRadius:5,
    color:'white',
    fontWeight: 'bold',
    padding:10,
    marginBottom:10,
    textAlign: 'center',
    backgroundColor:'skyblue',
    borderColor:'black',
    borderWidth:2,
  },
});

export default Title;
