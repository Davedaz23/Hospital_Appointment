import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const FooterMenu = ({ isDarkMode }) => {
  const navigation = useNavigation();
  const route = useRoute(); // Get current route information
  const [activeTab, setActiveTab] = useState(route.name); // Track active tab

  // Handle tab press
  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    navigation.navigate(tabName);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        {/* Footer Menu */}
        <View style={styles.footerMenu}>
          {/* Home Tab */}
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => handleTabPress('Appointment')}
          >
            <Ionicons 
              name="home" 
              size={24} 
              color={activeTab === 'Appointment' ? '#0066cc' : '#666'} 
            />
            <Text style={[
              styles.navText,
              activeTab === 'Appointment' && styles.activeNavText
            ]}>
              Home
            </Text>
          </TouchableOpacity>
          
          {/* Hospitals Tab */}
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => handleTabPress('Hospitals')}
          >
            <Ionicons 
              name="medkit" 
              size={24} 
              color={activeTab === 'Hospitals' ? '#0066cc' : '#666'} 
            />
            <Text style={[
              styles.navText,
              activeTab === 'Hospitals' && styles.activeNavText
            ]}>
              Hospitals
            </Text>
          </TouchableOpacity>
          
          {/* My Appointments Tab */}
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => handleTabPress('AppointmentList')}
          >
            <Ionicons 
              name="calendar" 
              size={24} 
              color={activeTab === 'AppointmentList' ? '#0066cc' : '#666'} 
            />
            <Text style={[
              styles.navText,
              activeTab === 'AppointmentList' && styles.activeNavText
            ]}>
              My Appointments
            </Text>
          </TouchableOpacity>
          
          {/* Profile Tab */}
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => handleTabPress('Profile')}
          >
            <Ionicons 
              name="person" 
              size={24} 
              color={activeTab === 'Profile' ? '#0066cc' : '#666'} 
            />
            <Text style={[
              styles.navText,
              activeTab === 'Profile' && styles.activeNavText
            ]}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 10,
  },
  darkContainer: {
    backgroundColor: '#1E1E1E',
  },
  footerMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
  activeNavText: {
    fontWeight: 'bold',
    color: '#0066cc',
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    height: 70,
    width: 40,
  },
  sitename: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  navText: {
    marginTop: 5, // Add some space between the icon and text
    fontSize: 12, // Adjust font size for better readability
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    padding: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: 200,
  },
  searchButton: {
    backgroundColor: 'blue',
    padding: 5,
    borderRadius: 5,
  },
  hospitalItem: {
    marginVertical: 10,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  hospitalRole: {
    fontSize: 14,
    color: '#666',
  },
  hospitalImage: {
    width: 100,
    height: 100,
    marginTop: 5,
  },
});

export default FooterMenu;