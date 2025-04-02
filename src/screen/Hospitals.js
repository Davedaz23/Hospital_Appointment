import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FooterMenu from './FooterMenu';
import { Ionicons } from '@expo/vector-icons';
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
  const [firebaseHospitals, setFirebaseHospitals] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // Admin check state

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
    
    // Check if the user is an admin (this logic depends on your authentication system)
    const checkAdminStatus = () => {
      // Example: if user has an admin role in their profile
      const userRole = 'admin'; // You would replace this with your actual logic
      setIsAdmin(userRole === 'admin');
    };

    checkAdminStatus();
  }, []);

  const hospitals = [
    { id: 1, name: "Bethzatha General Hospital", role: "Founded in May 2007...", img: "Bethzatha-General-Hospital" },
    { id: 2, name: "Hayat Hospital", role: "A Norwegian facility...", img: "Hayat-Hospital" },
    { id: 3, name: "Kadisco General Hospital", role: "Established in September 1996...", img: "Kadisco-General-Hospital" },
    { id: 4, name: "Landmark General Hospital", role: "Founded in 2008...", img: "Landmark-General-Hospital" },
    { id: 5, name: "Samaritan Surgical Center", role: "Known for high-quality care...", img: "Samaritan-Surgical-Center" },
    { id: 6, name: "Nordic Medical Centre", role: "A Norwegian facility with high-quality services...", img: "Nordic-Medical-Centre" },
    { id: 7, name: "Myungsung Christian Medical Center", role: "Surgical Care, Endoscopic & Laparoscopic Surgery...", img: "Myungsung-Christian-Medical-Center" },
    ...firebaseHospitals,
  ];

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Hospitals</Text>
          {hospitals.map((hospital) => (
  <TouchableOpacity
    key={hospital.id}
    style={styles.hospitalContainer}
    onPress={() =>
      navigation.navigate('Appointment', {
        selectedHospital: hospital,  // Pass the selected hospital here
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

          
          {/* Conditionally display the "Register New Hospital" button for admins */}
          {isAdmin && (
            <TouchableOpacity 
              style={styles.registrationButton} 
              onPress={() => navigation.navigate('HospitalRegistration')}>
              <Text style={styles.buttonText}>Register New Hospital</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 12,
    color: '#555',
  },
  registrationButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Hospitals;
