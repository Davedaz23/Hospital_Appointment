import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedPhone = await AsyncStorage.getItem('userPhone');
      if (storedPhone) {
        setUser(storedPhone);
      }
    };
    loadUser();
  }, []);

  const login = async (phone) => {
    await AsyncStorage.setItem('userPhone', phone);
    setUser(phone);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userPhone');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
