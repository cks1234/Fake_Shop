import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableHighlight, ActivityIndicator } from 'react-native';
import Title from '../components/Title';

const Categories = ({ navigation }) => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('https://fakestoreapi.com/products/categories')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setCategories(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const renderItem = ({ item }) => (
        <TouchableHighlight
            onPress={() => navigation.navigate('ItemsScreen', { category: item })}
            underlayColor="#DDD"
        >
            <View style={styles.item}>
                <Text style={styles.title}>{item}</Text>
            </View>
        </TouchableHighlight>
    );

    return (
        <View style={styles.container}>
            <Title>Categories</Title>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text>Error loading categories: {error}</Text>
            ) : (
                <FlatList
                    data={categories}
                    renderItem={renderItem}
                    keyExtractor={(item) => item}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10,
    },
    item: {
        padding: 10,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        backgroundColor: 'lightgray',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
    },
    title: {
        fontSize: 16,
        color: 'blue',
    },
});

export default Categories;
