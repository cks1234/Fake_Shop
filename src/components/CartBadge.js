import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CartBadge = ({ count }) => {
  if (count === 0) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -10,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    color: 'white',
    fontSize: 12,
  },
});

export default CartBadge;
