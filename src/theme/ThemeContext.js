import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import app from '../config/firebaseConfig';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const db = getFirestore(app);

  // Load dark mode preference from Firestore
  const loadDarkModePreference = async () => {
    try {
      const storedPhone = await AsyncStorage.getItem('userPhone');
      if (storedPhone) {
        const userRef = doc(db, 'users', storedPhone);
        const userSnapshot = await getDoc(userRef);
        
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setIsDarkMode(userData.darkMode || false);
        }
      }
    } catch (error) {
      console.error("Error loading dark mode preference:", error);
    }
  };

  // Save dark mode preference to Firestore
  const saveDarkModePreference = async (value) => {
    try {
      const storedPhone = await AsyncStorage.getItem('userPhone');
      if (storedPhone) {
        const userRef = doc(db, 'users', storedPhone);
        await updateDoc(userRef, { darkMode: value });
      }
    } catch (error) {
      console.error("Error saving dark mode preference:", error);
    }
  };

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await saveDarkModePreference(newMode);
  };

  useEffect(() => {
    loadDarkModePreference();
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);