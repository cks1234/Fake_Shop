import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Title from '../components/Title';
import Button from '../components/Button';
import { increaseQuantity, decreaseQuantity, clearCart } from '../store/cartSlice';
import { addOrder } from '../store/ordersSlice';
import { useNavigation } from '@react-navigation/native';

function CartScreen() {
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user); // Assuming user information is stored in auth state
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  useEffect(() => {
    if (!user || !user.id) {
      Alert.alert(
        "Access Denied",
        "You need to be signed in to access the Shopping Cart.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate('SignIn'), // Redirect to Sign In screen
          },
        ],
        { cancelable: false }
      );
    }
  }, [user, navigation]);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Checkout", "Your cart is empty.");
      return;
    }

    const order = {
      uid: user.id, // Include user id in the order
      items: cartItems,
      total_price: totalPrice,
      order_items: JSON.stringify(cartItems.map(item => ({
        prodID: item.id,
        price: item.price,
        quantity: item.quantity
      }))),
      date: new Date().toISOString(),
    };

    try {
      const response = await fetch('http://192.168.1.23:3000/orders/neworder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`, // Include token for authentication
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      const data = await response.json();
      console.log('Order created successfully:', data);
      
      dispatch(addOrder(data));
      dispatch(clearCart());
      Alert.alert("Checkout", "Your order has been placed.");
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert("Checkout Error", error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
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
    </View>
  );

  return (
    <View style={styles.container}>
      <Title>Shopping Cart</Title>
      {cartItems.length === 0 ? (
        <Text style={styles.empty}>Your Cart is Empty</Text>
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
          <Button title="Check Out" onPress={handleCheckout} />
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
    flexDirection: 'row',
    padding: 10,
    marginVertical: 10,
    backgroundColor: 'lightgray',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  details: {
    flex: 1,
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
