import axios from 'axios';
// export const API_URL = 'http://192.168.1.191:3000';
// api.js
import { Platform } from 'react-native';

export const API_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const AI_MODEL_API_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8000'
    : 'http://localhost:8000';
