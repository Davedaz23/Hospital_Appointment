import React, { useContext } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext'; // If you're using AuthContext
import {   StyleSheet } from 'react-native';


const LogoutButton = ({ isDarkMode, styles }) => {
  const navigation = useNavigation();
  const { setUser } = useContext(AuthContext); // Update user state in context (if using AuthContext)

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userPhone'); // Remove stored user phone
      setUser(null); // Clear user state in context (if using)
      navigation.replace('Login'); // Navigate to login screen
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
      <Text style={[styles.settingText, isDarkMode && styles.darkText]}>Logout</Text>
      <Ionicons name="log-out" size={20} color={isDarkMode ? '#fff' : '#000'} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
 
 
  darkText: {
    color: '#fff',
  },
  settingsContainer: {
    marginTop: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
 
  settingText: {
    fontSize: 16,
  },
});


export default LogoutButton;
