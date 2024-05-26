import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '../store/authSlice';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Button from '../components/Button';
import { Ionicons } from '@expo/vector-icons';

const UserProfileScreen = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!user) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    }
  }, [user, navigation]);

  useEffect(() => {
    if (isFocused && user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [isFocused, user]);

  const handleSignOut = () => {
    dispatch(signOut());
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    });
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>You are not logged in</Text>
        <Button title="Sign In" onPress={() => navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        })} iconName="log-in" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text>Name</Text>
      <TextInput
        style={styles.input}

        value={name}
        editable={false} // Make name read-only in profile view
      />
      <Text>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        editable={false} // Make email read-only
      />
      <View style={styles.buttonRow}>
        <Button 
          title="Update" 
          onPress={() => navigation.navigate('UpdateProfile')}
          iconName="pencil"
        />
        <Button 
          title="Sign Out" 
          onPress={handleSignOut}
          iconName="log-out"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default UserProfileScreen;
