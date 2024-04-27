import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import Title from '../components/Title';
import Button from '../components/Button';
import LoadingIndicator from '../components/loadingindicator';

function ItemsScreen({ route, navigation }) {
    const { category } = route.params;
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`)
            .then(res => res.json())
            .then(data => {
                const augmentedData = data.map(item => ({
                    ...item,
                    sold: Math.floor(Math.random() * 1000),  // Randomly generating sold units
                    rate: (Math.random() * 5).toFixed(2)  // Randomly generating a rating between 0 and 5
                }));
                setItems(augmentedData);
                setLoading(false);
            })
            .catch(error => {
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
        return <LoadingIndicator color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <Title style={styles.header}>{category}</Title>
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
                    keyExtractor={item => item.id.toString()}
                />
            <View style={styles.buttonsContainer}>
                <Button iconName="arrow-back" title="Back" onPress={handleBack} />
            </View>
        </View>
        
    );
}

const styles = StyleSheet.create({
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
});

export default ItemsScreen;
