import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Categories from './src/screens/Categories';
import ItemsScreen from './src/screens/ItemsScreen'; 
import ItemDetailScreen from './src/screens/ItemDetailScreen';
import SplashScreen from './src/screens/SplashScreen';


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Categories" component={Categories} />
        
        <Stack.Screen name="ItemsScreen" component={ItemsScreen} />
        <Stack.Screen name="ItemDetailScreen" component={ItemDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;