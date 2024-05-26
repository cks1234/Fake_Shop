import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Provider, useSelector } from 'react-redux';
import { View } from 'react-native';
import store from './src/store/store';

import SplashScreen from './src/screens/SplashScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import Categories from './src/screens/Categories';
import ItemsScreen from './src/screens/ItemsScreen';
import ItemDetailScreen from './src/screens/ItemDetailScreen';
import CartScreen from './src/screens/CartScreen';
import MyOrdersScreen from './src/screens/MyOrdersScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import UpdateProfileScreen from './src/screens/UpdateProfileScreen'; // Import the new screen
import CartBadge from './src/components/CartBadge';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CategoriesStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Categories" component={Categories} options={{ title: 'Product Categories' }} />
      <Stack.Screen 
        name="ItemsScreen" 
        component={ItemsScreen} 
        options={({ route }) => ({ title: route.params.category })} 
      />
      <Stack.Screen 
        name="ItemDetailScreen" 
        component={ItemDetailScreen} 
        options={{ title: 'Product Details' }} />
    </Stack.Navigator>
  );
}

function MainTabNavigator() {
  const cartItemsCount = useSelector((state) => state.cart.items.reduce((total, item) => total + item.quantity, 0));
  const newOrdersCount = useSelector((state) => state.orders.orders.filter(order => order.is_paid === 0).length);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconBadge = null;

          if (route.name === 'Products') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
            iconBadge = <CartBadge count={cartItemsCount} />;
          } else if (route.name === 'Orders') {
            iconName = focused ? 'list' : 'list-outline';
            iconBadge = <CartBadge count={newOrdersCount} />;
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
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
      <Tab.Screen name="Products" component={CategoriesStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
      <Tab.Screen name="Orders" component={MyOrdersScreen} options={{ title: 'My Orders' }} />
      <Tab.Screen name="Profile" component={UserProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Sign In' }} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
          <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} options={{ title: 'Update Profile', presentation: 'modal' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
