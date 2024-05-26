import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { updateUser } from '../store/authSlice';
import Button from '../components/Button'; 
import { Ionicons } from '@expo/vector-icons';

const UpdateProfileScreen = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [name, setName] = useState(user ? user.name : '');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleUpdate = async () => {
    const url = `http://192.168.1.23:3000/users/update`;
    const userUpdate = { name, password };
    try {
      const res = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userUpdate),
      });
      const data = await res.json();
      if (data.status === 'OK') {
        // Update the user state in the Redux store
        dispatch(updateUser({ name: data.name }));

        Alert.alert("Success", data.message);
        navigation.goBack(); // Go back to the profile screen
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      Alert.alert("Update Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Profile</Text>
      <Text>New Name</Text>
      <TextInput
        style={styles.input}
        placeholder="New Name"
        value={name}
        onChangeText={setName}
      />
      <Text>New Password</Text>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonRow}>
        <Button title="Save" onPress={handleUpdate} iconName="save" />
        <Button title="Cancel" onPress={() => navigation.goBack()} iconName="close" />
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

export default UpdateProfileScreen;
