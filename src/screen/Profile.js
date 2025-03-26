import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import FooterMenu from './FooterMenu';

const Profile = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
  const [notificationsEnabled, setNotificationsEnabled] = useState(true); // State for notifications

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    // Add logic to apply dark/light theme globally
  };

  // Toggle notifications
  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
    // Add logic to enable/disable notifications
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>Profile</Text>
      </View>

      {/* Settings Options */}
      <View style={styles.settingsContainer}>
        {/* Dark Mode Toggle */}
        <View style={styles.settingItem}>
          <Text style={[styles.settingText, isDarkMode && styles.darkText]}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        {/* Notifications Toggle */}
        <View style={styles.settingItem}>
          <Text style={[styles.settingText, isDarkMode && styles.darkText]}>Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        {/* Help & Support */}
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('HelpSupport')}>
          <View style={styles.iconTextContainer}>
            <Ionicons name="help-circle-outline" size={20} color={isDarkMode ? '#fff' : '#000'} />
            <Text style={[styles.settingText, isDarkMode && styles.darkText]}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>

        {/* Privacy Policy */}
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('PrivacyPolicy')}>
          <View style={styles.iconTextContainer}>
            <Ionicons name="shield-checkmark-outline" size={20} color={isDarkMode ? '#fff' : '#000'} />
            <Text style={[styles.settingText, isDarkMode && styles.darkText]}>Privacy Policy</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>

        {/* Terms & Conditions */}
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('TermsConditions')}>
          <View style={styles.iconTextContainer}>
            <Ionicons name="document-text-outline" size={20} color={isDarkMode ? '#fff' : '#000'} />
            <Text style={[styles.settingText, isDarkMode && styles.darkText]}>Terms & Conditions</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.settingText, isDarkMode && styles.darkText]}>Logout</Text>
          <Ionicons name="log-out" size={20} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>
      <FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
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
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Space between icon and text
  },
  settingText: {
    fontSize: 16,
  },
});

export default Profile;