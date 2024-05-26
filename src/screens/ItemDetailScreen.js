import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import Button from '../components/Button';
import Title from '../components/Title';

const ItemDetailScreen = ({ route, navigation }) => {
    const { item } = route.params;
    const [product, setProduct] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        fetch(`https://fakestoreapi.com/products/${item.id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching product:', error);
                setLoading(false);
            });
    }, [item.id]);

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.container}>
                <Text>Error loading product details.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Title>Product Details</Title>
            <Image source={{ uri: product.image }} style={styles.image} />
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.rating}>Rating: {product.rating.rate} ({product.rating.count} sold)</Text>
            <Text style={styles.price}>${product.price}</Text>
            <Text style={styles.description}>{product.description}</Text>
            <View style={styles.buttonContainer}>
                <Button
                    iconName="arrow-back"
                    title="Back"
                    onPress={() => navigation.goBack()}
                />
                <Button
                    iconName="cart-outline"
                    title="Add to Cart"
                    onPress={() => {
                        dispatch(addToCart(product));
                        Alert.alert("Added to Cart", "The item has been added to your cart.");
                    }}
                />
            </View>
        </ScrollView>
    );
};

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
    rating: {
        fontSize: 18,
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'green',
        marginBottom: 10,
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
        justifyContent: 'space-between',
        marginBottom: 20,
    },
});

export default ItemDetailScreen;
