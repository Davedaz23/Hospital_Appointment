import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('english');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('appLanguage');
        if (savedLanguage) {
          setLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    
    loadLanguage();
  }, []);

  const changeLanguage = async (lang) => {
    try {
      await AsyncStorage.setItem('appLanguage', lang);
      setLanguage(lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};