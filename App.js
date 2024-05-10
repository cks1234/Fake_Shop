import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Provider, useSelector } from 'react-redux';
import { View } from 'react-native';
import Categories from './src/screens/Categories';
import ItemsScreen from './src/screens/ItemsScreen';
import ItemDetailScreen from './src/screens/ItemDetailScreen';
import SplashScreen from './src/screens/SplashScreen';
import CartScreen from './src/screens/CartScreen';
import CartBadge from './src/components/CartBadge';
import { store } from './src/store/store';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Categories" component={Categories} options={{ title: 'Categories' }} />
      <Stack.Screen name="ItemsScreen" component={ItemsScreen} options={{ title: 'Items' }} />
      <Stack.Screen name="ItemDetailScreen" component={ItemDetailScreen} options={{ title: 'Item Details' }} />
    </Stack.Navigator>
  );
}

function BottomTabNavigator() {
  const cartItemsCount = useSelector((state) => state.cart.items.reduce((total, item) => total + item.quantity, 0));

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconBadge = null;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
            iconBadge = <CartBadge count={cartItemsCount} />;
          }

          return (
            <View>
              <Ionicons name={iconName} size={size} color={color} />
              {iconBadge}
            </View>
          );
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={StackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
    </Tab.Navigator>
  );
}

function App() {
  const [isSplashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 2000); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
