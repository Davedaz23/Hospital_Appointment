import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // For navigation
import { Ionicons } from '@expo/vector-icons'; // For icons
import Login from './screen/Login';
import MainContent from './screen/main';

const Header = () => {
  const [query, setQuery] = useState(''); // State to hold search query
  const [searchVal, setSearchVal] = useState(''); // State to filter the hospital list
  const [filteredHospitals, setFilteredHospitals] = useState([]); // State for filtered hospitals
  const navigation = useNavigation(); // For navigating to search results page

  // Hospital data (should be initially available but not rendered until search)
  const hospitalList = [
    { id: 1, name: "Bethzatha-General-Hospital", role: "Founded in May 2007...", img: "https://example.com/Bethzatha-General-Hospital.jpg" },
    { id: 2, name: "Hayat-Hospital", role: "A Norwegian facility...", img: "https://example.com/Hayat-Hospital.jpg" },
    { id: 3, name: "Kadisco-General-Hospital", role: "Established in 1996...", img: "https://example.com/Kadisco-General-Hospital.jpg" },
    { id: 4, name: "Landmark-General-Hospital", role: "Founded in 2008...", img: "https://example.com/Landmark-General-Hospital.jpg" },
    { id: 5, name: "Samaritan-Surgical-Center", role: "Known for providing high-standard care...", img: "https://example.com/Samaritan-Surgical-Center.jpg" },
    { id: 6, name: "Nordic-Medical-Centre", role: "A Norwegian facility...", img: "https://example.com/Nordic-Medical-Centre.jpg" },
    { id: 7, name: "Myungsung-Christian-Medical-Center", role: "Surgical Care, Endoscopic Surgery...", img: "https://example.com/Myungsung-Christian-Medical-Center.jpg" },
  ];

  // Handle form submission for hospital search
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigation.navigate('SearchResults', { query }); // Redirect to search results with query
    }
  };

  // Handle search input change
  const handleSearchClick = () => {
    if (searchVal === "") {
      setFilteredHospitals([]); // Reset the results if search is empty
      return;
    }
    const filtered = hospitalList.filter((hospital) =>
      hospital.name.toLowerCase().includes(searchVal.toLowerCase()) // Filter based on hospital name
    );
    setFilteredHospitals(filtered); // Update the filtered list
  };

  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        <View style={styles.contactInfo}>
          <Ionicons name="mail" size={20} color="black" />
          <Text style={styles.contactText}>care4you@MOH.org</Text>
          <Ionicons name="call" size={20} color="black" style={styles.contactIcon} />
          <Text style={styles.contactText}>+251939945270</Text>
        </View>
        <View style={styles.socialLinks}>
          <TouchableOpacity><Ionicons name="logo-twitter" size={20} color="black" /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="logo-facebook" size={20} color="black" /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="logo-instagram" size={20} color="black" /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="logo-linkedin" size={20} color="black" /></TouchableOpacity>
        </View>
      </View>

      <View style={styles.branding}>
        <View style={styles.logoContainer}>
          {/* <Image source={{ uri: 'https://example.com/logo192.png' }} style={styles.logo} /> */}
          <Text style={styles.sitename}>care4you</Text>
        </View>

        <ScrollView horizontal style={styles.navmenu}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('MainContent')}><Text>Home</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navItem}><Text>About</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navItem}><Text>Services</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navItem}><Text>Doctors</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navItem}><Text>Contact</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navItem}><Text>UserRegistration</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navItem}><Text>Login</Text></TouchableOpacity>
        </ScrollView>

        {/* <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            onChangeText={setSearchVal} 
            placeholder="Search hospitals..."
            value={searchVal}
          />
          <TouchableOpacity onPress={handleSearchClick} style={styles.searchButton}>
            <Ionicons name="search" size={25} color="white" />
          </TouchableOpacity>
        </View> */}
      </View> 

      
      {
        filteredHospitals.length > 0 && (
        <FlatList
          data={filteredHospitals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.hospitalItem}>
              <Text style={styles.hospitalName}>{item.name}</Text>
              <Text style={styles.hospitalRole}>{item.role}</Text>
              <Image source={{ uri: item.img }} style={styles.hospitalImage} />
            </View>
          )}
        />
      )} 
      <Login />
    </View> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    marginLeft: 5,
  },
  contactIcon: {
    marginLeft: 10,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  navmenu: {
    flexDirection: 'row',
  },
  navItem: {
    marginHorizontal: 10,
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

export default Header;