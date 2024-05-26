import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableHighlight, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import Title from '../components/Title';

const Categories = ({ navigation }) => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userName = useSelector((state) => state.auth.user?.name); // Get the user's name from the Redux store

    useEffect(() => {
        fetch('https://fakestoreapi.com/products/categories')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (userName) {
                    setCategories([...data, userName]);  // Add the user's name to the categories list
                } else {
                    setCategories(data);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
                setError(error.message);
                setLoading(false);
            });
    }, [userName]);

    const renderItem = ({ item }) => {
        if (item === userName) {
            return (
                <View style={styles.userNameContainer}>
                    <Text style={styles.userName}>{item}</Text>
                </View>
            );
        }
        return (
            <TouchableHighlight
                onPress={() => navigation.navigate('ItemsScreen', { category: item })}
                underlayColor="#DDD"
            >
                <View style={styles.item}>
                    <Text style={styles.title}>{item}</Text>
                </View>
            </TouchableHighlight>
        );
    };

    return (
        <View style={styles.container}>
            <Title>Categories</Title>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={styles.error}>Error loading categories: {error}</Text>
            ) : (
                <FlatList
                    data={categories}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
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
    error: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    userNameContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    userName: {
        fontSize: 16,
        color: 'blue',
    },
});

export default Categories;
