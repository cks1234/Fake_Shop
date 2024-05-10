import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function CartBadge({ count }) {
  if (count <= 0) return null;

  return (
    <View style={styles.badgeContainer}>
      <Text style={styles.badgeText}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    position: 'absolute',
    right: -10,
    top: -10,
    backgroundColor: 'tomato',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default CartBadge;
