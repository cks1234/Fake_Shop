import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { signIn } from '../store/authSlice';
import Button from '../components/Button'; // Assuming you have a Button component

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    try {
      const data = await signInUser({ email, password });
      if (data.status === 'error') {
        setError(data.message);
        Alert.alert("Sign In Error", data.message);
      } else {
        dispatch(signIn({ user: data, token: data.token }));
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      }
    } catch (error) {
      setError(error.message);
      Alert.alert("Sign In Error", error.message);
    }
  };

  const handleClear = () => {
    setEmail('');
    setPassword('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In with your email and password</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
        <View style={styles.buttonRow}>
          <Button title="Sign In" onPress={handleSignIn} iconName="log-in" />
      <Button title="Clear" onPress={handleClear} iconName="close-circle" />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      <Text style={styles.switchText} onPress={() => navigation.navigate('SignUp')}>
        Switch to: Sign Up
      </Text>
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
  switchText: {
    marginTop: 20,
    color: 'blue',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default SignInScreen;

const signInUser = async ({ email, password }) => {
  const url = `http://192.168.1.23:3000/users/signin`; // Replace with your local IP address
  const user = { email, password };
  try {
    console.log('Sending request to:', url);
    console.log('Request payload:', user);

    const res = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.message || 'Something went wrong');
    }

    const data = await res.json();
    console.log('Response data:', data);

    return data; // data.token is the token value.
  } catch (error) {
    console.error('Error during sign in:', error);
    throw new Error("Failed to sign in: " + error.message);
  }
};
