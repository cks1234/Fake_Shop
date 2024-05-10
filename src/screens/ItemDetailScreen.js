import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../components/Button';
import Title from '../components/Title';
import { addItem } from '../store/cartSlice';

function ItemDetailScreen({ route, navigation }) {
    const { item } = route.params;
    const [isLoading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleAddToCart = () => {
        dispatch(addItem(item));
    };

    const handleCart = () => {
        navigation.navigate('CartScreen');
    };

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Title>Product Details</Title>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>Price: ${item.price}</Text>
            <Text style={styles.sold}>Units Sold: {item.sold}</Text>
            <Text style={styles.rate}>Rating: {item.rate} / 5</Text>
            <View style={styles.buttonContainer}>
                <Button iconName="arrow-back" title="Back" onPress={handleBack} />
                <Button iconName="cart-outline" title="Add to Cart" onPress={handleAddToCart} />
    
            </View>
            <Text style={styles.title}>Description:</Text>
            <Text style={styles.description}>{item.description}</Text>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    image: {
        width: '100%',
        height: 300,
        marginBottom: 20,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'green',
        marginBottom: 10,
    },
    sold: {
        fontSize: 16,
        marginBottom: 10,
    },
    rate: {
        fontSize: 16,
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        backgroundColor: '#d3d3d3',
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
});

export default ItemDetailScreen;
