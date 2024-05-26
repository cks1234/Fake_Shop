import axios from 'axios';
import { Platform } from 'react-native';

const baseURL = Platform.select({
    ios: 'http://localhost:3000',
    android: 'http://10.0.2.2:3000' // Android emulator uses a different IP to access localhost
});

export const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(request => {
    console.log('Starting Request', request);
    return request;
});

api.interceptors.response.use(
    response => {
        console.log('Response:', response);
        return response;
    },
    error => {
        console.log('Error:', error.response ? error.response : error.message);
        return Promise.reject(error);
    }
);

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};
