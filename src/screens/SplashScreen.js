import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Categories');  
        }, 3000); 

        return () => clearTimeout(timer);  
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image
                source={require('../photos/logo.jpg')} 
                style={styles.fullscreenImage}
            />
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
    fullscreenImage: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});

export default SplashScreen;
