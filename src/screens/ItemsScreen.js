import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Title from '../components/Title';
import Button from '../components/Button';

function ItemsScreen({ route, navigation }) {
    const { category } = route.params || {};
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!category) {
            return;
        }

        fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`)
            .then((res) => res.json())
            .then((data) => {
                const augmentedData = data.map((item) => ({
                    ...item,
                }));
                setItems(augmentedData);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching items:', error);
                setLoading(false);
            });
    }, [category]);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleItemPress = (item) => {
        navigation.navigate('ItemDetailScreen', { item });
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!category) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>No category selected</Text>
                <Button iconName="arrow-back" title="Back" onPress={handleBack} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Title style={styles.header}>{category}</Title>
            {items.length === 0 ? (
                <Text style={styles.emptyMessage}>No items available in this category.</Text>
            ) : (
                <FlatList
                    data={items}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleItemPress(item)}>
                            <View style={styles.item}>
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.image}
                                    resizeMode="contain"
                                />
                                <Text style={styles.price}>Price: ${item.price}</Text>
                                <Text style={styles.title}>{item.title}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
            <View style={styles.buttonsContainer}>
                <Button iconName="arrow-back" title="Back" onPress={handleBack} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        marginBottom: 10,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    item: {
        padding: 10,
        flexDirection: 'column',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 10,
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'green',
    },
    buttonsContainer: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: 16,
        color: 'gray',
    },
});

export default ItemsScreen;