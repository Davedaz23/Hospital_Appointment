import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, FlatList, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // For navigation
import { Ionicons } from '@expo/vector-icons'; // For icons

const FooterMenu = () => {
  const [query, setQuery] = useState(''); // State to hold search query
  const [searchVal, setSearchVal] = useState(''); // State to filter the hospital list
  const [filteredHospitals, setFilteredHospitals] = useState([]); // State for filtered hospitals
  const navigation = useNavigation(); // For navigating to search results page
  const [otpSent, setOtpSent] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Footer Menu */}
        <View style={styles.footerMenu}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Appointment')}>
            <Ionicons name="calendar" size={24} color="black" />
            <Text style={styles.navText}>Appointment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Hospitals')}>
            <Ionicons name="medkit" size={24} color="black" />
            <Text style={styles.navText}>Hospitals</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('About')}>
            <Ionicons name="information-circle" size={24} color="black" />
            <Text style={styles.navText}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Contact')}>
            <Ionicons name="call" size={24} color="black" />
            <Text style={styles.navText}>Contact</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Login')}>
            <Ionicons name="call" size={24} color="black" />
            <Text style={styles.navText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PatientRegistration')}>
            <Ionicons name="person-add" size={24} color="black" />
            <Text style={styles.navText}>Registration</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person" size={24} color="black" />
            <Text style={styles.navText}>profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
    alignItems: 'center', // Center icon and text horizontally
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