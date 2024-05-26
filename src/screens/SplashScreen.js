import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 2000); // Adjust the delay as needed
    return () => clearTimeout(timer); // Clear the timer if the component unmounts
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fake Store</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
