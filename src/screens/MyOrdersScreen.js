import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { fetchOrders, updateOrderStatus } from '../store/ordersSlice';
import Title from '../components/Title';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';

const MyOrdersScreen = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.orders);
  const userToken = useSelector((state) => state.auth.token);
  const navigation = useNavigation();
  const [expandedSections, setExpandedSections] = useState({ new: false, paid: false, delivered: false });
  const [expandedOrders, setExpandedOrders] = useState({});

  useFocusEffect(
    useCallback(() => {
      if (!userToken) {
        navigation.navigate('SignIn');
        Alert.alert(
          "Access Denied",
          "You need to be signed in to view your orders.",
          { cancelable: false }
        );
      } else {
        dispatch(fetchOrders(userToken));
      }
    }, [dispatch, userToken, navigation])
  );

  useEffect(() => {
    console.log('Fetched orders:', orders);
  }, [orders]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleOrder = (orderId) => {
    setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const handlePay = (orderId) => {
    dispatch(updateOrderStatus({ orderId, isPaid: 1, isDelivered: 0 }))
      .then(() => {
        Alert.alert("Order Paid", "Your order has been paid.");
        dispatch(fetchOrders(userToken));
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  const handleReceive = (orderId) => {
    dispatch(updateOrderStatus({ orderId, isPaid: 1, isDelivered: 1 }))
      .then(() => {
        Alert.alert("Order Delivered", "Your order has been delivered.");
        dispatch(fetchOrders(userToken));
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  const renderOrderItem = ({ item }) => {
    const totalItems = item.order_items.reduce((total, orderItem) => total + orderItem.quantity, 0);
    const totalPrice = item.order_items.reduce((total, orderItem) => total + orderItem.price * orderItem.quantity, 0).toFixed(2);

    return (
      <View style={styles.item}>
        <TouchableOpacity onPress={() => toggleOrder(item.id)} style={styles.orderHeader}>
          <Text style={styles.title}>Order ID: {item.id}</Text>
          <Text style={styles.summary}>Total Items: {totalItems} | Total Price: ${totalPrice}</Text>
          <Ionicons name={expandedOrders[item.id] ? 'caret-up' : 'caret-down'} size={20} />
        </TouchableOpacity>
        {expandedOrders[item.id] && (
          <View>
            <FlatList
              data={item.order_items}
              renderItem={({ item }) => (
                <View style={styles.subItem}>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <View style={styles.details}>
                    <Text style={styles.subTitle}>{item.title}</Text>
                    <Text style={styles.price}>Price: ${item.price}</Text>
                    <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
                  </View>
                </View>
              )}
              keyExtractor={(subItem) => (subItem.prodID ? subItem.prodID.toString() : Math.random().toString())}
            />
            {item.is_paid === 0 && item.is_delivered === 0 && <Button title="Pay" onPress={() => handlePay(item.id)} />}
            {item.is_paid === 1 && item.is_delivered === 0 && <Button title="Receive" onPress={() => handleReceive(item.id)} />}
          </View>
        )}
      </View>
    );
  };

  const categorizedOrders = {
    new: orders.filter(order => order.is_paid === 0 && order.is_delivered === 0),
    paid: orders.filter(order => order.is_paid === 1 && order.is_delivered === 0),
    delivered: orders.filter(order => order.is_paid === 1 && order.is_delivered === 1)
  };

  return (
    <View style={styles.container}>
      <Title>My Orders</Title>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          {['new', 'paid', 'delivered'].map(section => (
            <View key={section}>
              <TouchableOpacity onPress={() => toggleSection(section)} style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section.charAt(0).toUpperCase() + section.slice(1)} Orders ({categorizedOrders[section].length})</Text>
                <Ionicons name={expandedSections[section] ? 'caret-up' : 'caret-down'} size={20} />
              </TouchableOpacity>
              {expandedSections[section] && (
                <FlatList
                  data={categorizedOrders[section]}
                  renderItem={renderOrderItem}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={styles.flatListContent}
                />
              )}
            </View>
          ))}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'lightgrey',
    paddingHorizontal: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  item: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: 'lightgray',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingBottom: 20, // Added padding at the bottom for the button
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subItem: {
    flexDirection: 'row',
    padding: 5,
    marginVertical: 5,
    backgroundColor: 'white',
    borderColor: 'gray',
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
  subTitle: {
    fontSize: 14,
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
  date: {
    fontSize: 12,
    color: 'gray',
  },
  summary: {
    fontSize: 16,
    marginVertical: 10,
  },
  error: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },

});

export default MyOrdersScreen;
