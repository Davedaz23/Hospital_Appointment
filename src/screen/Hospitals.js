import { View, Text, Image, ImageBackground, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from './LanguageContext';
import React, { useState, useEffect, useContext } from 'react';
import db from '../config/firestoreConfig';
import { collection, getDocs } from 'firebase/firestore';

const hospitalImages = {
  'Bethzatha-General-Hospital': require('../assets/Hospitals/Bethzatha-General-Hospital.jpg'),
  'Hayat-Hospital': require('../assets/Hospitals/Hayat-Hospital.jpg'),
  'Kadisco-General-Hospital': require('../assets/Hospitals/Kadisco-General-Hospital.jpg'),
  'Landmark-General-Hospital': require('../assets/Hospitals/Landmark-General-Hospital.jpg'),
  'Samaritan-Surgical-Center': require('../assets/Hospitals/Samaritan-Surgical-Center.jpg'),
  'Nordic-Medical-Centre': require('../assets/Hospitals/Nordic-Medical-Centre.jpg'),
  'Myungsung-Christian-Medical-Center': require('../assets/Hospitals/Myungsung-Christian-Medical-Center.jpg'),
};

const Hospitals = () => {
  const navigation = useNavigation();
  const { language } = useContext(LanguageContext);

  const translations = {
    english: {
      topHospitals: "Top Hospitals",
      registerNewHospital: "Register New Hospital",
      hospital1: "Bethzatha General Hospital",
      hospital1Desc: "Founded in May 2007 by the Kadisco group...",
      hospital2: "Hayat Hospital",
      hospital2Desc: "A Norwegian facility run by experienced medical professionals.",
      hospital3: "Kadisco General Hospital",
      hospital3Desc: "Established in September 1996, the first private hospital of its kind.",
      hospital4: "Landmark General Hospital",
      hospital4Desc: "Known for high-quality medical care services.",
      hospital5: "Samaritan Surgical Center",
      hospital5Desc: "Striving to improve healthcare service in Ethiopia.",
      hospital6: "Nordic Medical Centre",
      hospital6Desc: "Delivers high-quality medical services 24/7.",
      hospital7: "Myungsung Christian Medical Center",
      hospital7Desc: "Surgical Care, Endoscopic & Laparoscopic Surgery.",
    },
    amharic: {
      topHospitals: "ከፍተኛ ሆስፒታሎች",
      registerNewHospital: "አዲስ ሆስፒታል ይመዝገቡ",
      hospital1: "ቤተ ዘታ ጄኔራል ሆስፒታል",
      hospital1Desc: "በመጋቢት 2007 በካዲስኮ ቡድን የተመሰረተው...",
      // Add other translations here...
    },
  };

  const t = translations[language];

  const [firebaseHospitals, setFirebaseHospitals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHospitals, setFilteredHospitals] = useState([]);

  useEffect(() => {
    const fetchFirebaseHospitals = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'hospitals'));
        const fetchedHospitals = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          role: doc.data().description,
          img: doc.data().photo,
        }));
        setFirebaseHospitals(fetchedHospitals);
      } catch (error) {
        console.error('Error fetching hospitals from Firestore:', error);
      }
    };
    fetchFirebaseHospitals();
  }, []);

  useEffect(() => {
    const hospitals = [
      { id: 1, name: t.hospital1, role: t.hospital1Desc, img: "Bethzatha-General-Hospital" },
      { id: 2, name: t.hospital2, role: t.hospital2Desc, img: "Hayat-Hospital" },
      { id: 3, name: t.hospital3, role: t.hospital3Desc, img: "Kadisco-General-Hospital" },
      { id: 4, name: t.hospital4, role: t.hospital4Desc, img: "Landmark-General-Hospital" },
      { id: 5, name: t.hospital5, role: t.hospital5Desc, img: "Samaritan-Surgical-Center" },
      { id: 6, name: t.hospital6, role: t.hospital6Desc, img: "Nordic-Medical-Centre" },
      { id: 7, name: t.hospital7, role: t.hospital7Desc, img: "Myungsung-Christian-Medical-Center" },
      ...firebaseHospitals,
    ];

    const filtered = hospitals.filter(hospital =>
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredHospitals(filtered);
  }, [searchQuery, firebaseHospitals]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hospitals</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Hospitals..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.topHospitals}</Text>
          {filteredHospitals.map(hospital => (
            <TouchableOpacity
              key={hospital.id}
              style={styles.hospitalContainer}
              onPress={() =>
                navigation.navigate('Appointment', {
                  selectedHospital: hospital,
                })
              }
            >
              <Image source={hospitalImages[hospital.img] || { uri: hospital.img }} style={styles.hospitalImage} />
              <View style={styles.hospitalTextContainer}>
                <Text style={styles.hospitalName}>{hospital.name}</Text>
                <Text style={styles.hospitalRole}>{hospital.role}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: 'transparent',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 40,
    
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '##2196F3',
    borderRadius: 5,
    margin: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginRight: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '##2196F3',
    padding: 10,
    borderRadius: 5,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  hospitalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  hospitalImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  hospitalTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  hospitalRole: {
    fontSize: 14,
    color: '#666',
  },
});

export default Hospitals;