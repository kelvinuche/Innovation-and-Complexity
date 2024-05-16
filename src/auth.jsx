// auth.js

import users from '../users.json';

export const login = (username, password) => {
  // Find user in users array by username
  const user = users.find(user => user.username === username);

  // If user not found or password doesn't match, return false
  if (!user || user.password !== password) {
    return false;
  }

  // If user found and password matches, store user data in localStorage (or use JWT token)
  localStorage.setItem('user', JSON.stringify(user));
  return true;
};

export const logout = () => {
  // Clear user data from localStorage (or JWT token)
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  // Check if user data exists in localStorage (or JWT token)
  return localStorage.getItem('user') !== null;
};
