// src/api.js
import axios from 'axios';

const API = axios.create({
  // baseURL: 'https://api.techqubits.com', // Use HTTP as required
  baseURL: 'http://localhost:3200', // Use HTTP as required
  timeout: 5000, // Timeout for requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Attach token to every request
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
