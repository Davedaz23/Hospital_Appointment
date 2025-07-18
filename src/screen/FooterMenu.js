import React, { useState } from 'react';
<<<<<<< HEAD
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  TouchableWithoutFeedback, 
  Keyboard,
  SafeAreaView,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FooterMenu = ({ isDarkMode }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState(route.name);
  const insets = useSafeAreaInsets();

=======
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const FooterMenu = ({ isDarkMode }) => {
  const navigation = useNavigation();
  const route = useRoute(); // Get current route information
  const [activeTab, setActiveTab] = useState(route.name); // Track active tab

  // Handle tab press
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    navigation.navigate(tabName);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        {/* Footer Menu */}
<<<<<<< HEAD
        <View style={[
          styles.footerMenu, 
          isDarkMode && styles.darkFooterMenu,
          { 
            paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
            height: 60 + (insets.bottom > 0 ? insets.bottom : 20)
          }
        ]}>
=======
        <View style={styles.footerMenu}>
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
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
<<<<<<< HEAD
              activeTab === 'Appointment' && styles.activeNavText,
              isDarkMode && styles.darkNavText
=======
              activeTab === 'Appointment' && styles.activeNavText
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
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
<<<<<<< HEAD
              activeTab === 'Hospitals' && styles.activeNavText,
              isDarkMode && styles.darkNavText
=======
              activeTab === 'Hospitals' && styles.activeNavText
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
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
<<<<<<< HEAD
              activeTab === 'AppointmentList' && styles.activeNavText,
              isDarkMode && styles.darkNavText
=======
              activeTab === 'AppointmentList' && styles.activeNavText
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
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
<<<<<<< HEAD
              activeTab === 'Profile' && styles.activeNavText,
              isDarkMode && styles.darkNavText
=======
              activeTab === 'Profile' && styles.activeNavText
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
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
<<<<<<< HEAD
=======
    flex: 1,
    padding: 10,
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
  },
  darkContainer: {
    backgroundColor: '#1E1E1E',
  },
  footerMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
<<<<<<< HEAD
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
=======
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
<<<<<<< HEAD
  },
  darkFooterMenu: {
    backgroundColor: '#1E1E1E',
    borderTopColor: '#333',
=======
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
<<<<<<< HEAD
  darkNavText: {
    color: '#aaa',
  },
=======
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
  activeNavText: {
    fontWeight: 'bold',
    color: '#0066cc',
  },
<<<<<<< HEAD
=======
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
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
});

export default FooterMenu;