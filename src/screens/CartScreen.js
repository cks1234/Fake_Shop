import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Title from '../components/Title';
import Button from '../components/Button';
import {
    increaseQuantity,
    decreaseQuantity,
} from '../store/cartSlice';

function CartScreen() {
    const cartItems = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();

    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>Price: ${item.price}</Text>
            <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
            <View style={styles.quantityButtons}>
                <TouchableOpacity onPress={() => dispatch(increaseQuantity(item.id))}>
                    <Text style={styles.button}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => dispatch(decreaseQuantity(item.id))}>
                    <Text style={styles.button}>-</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Title>Shopping Cart</Title>
            {cartItems.length === 0 ? (
                <Text style={styles.empty}>Your shopping cart is empty</Text>
            ) : (
                <>
                    <Text style={styles.summary}>
                        Total Items: {totalQuantity} | Total Price: ${totalPrice}
                    </Text>
                    <FlatList
                        data={cartItems}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        marginHorizontal: 10,
    },
    item: {
        padding: 10,
        marginVertical: 10,
        backgroundColor: 'lightgray',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
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
    quantity: {
        fontSize: 14,
        color: 'blue',
    },
    quantityButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        fontSize: 18,
        color: 'blue',
        paddingHorizontal: 10,
    },
    summary: {
        fontSize: 16,
        marginVertical: 10,
    },
    empty: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: 'gray',
    },
});

export default CartScreen;
