import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons

const hospitalImages = {
  'Bethzatha-General-Hospital': require('../assets/Hospitals/Bethzatha-General-Hospital.jpg'),
  'Hayat-Hospital': require('../assets/Hospitals/Hayat-Hospital.jpg'),
  'Kadisco-General-Hospital': require('../assets/Hospitals/Kadisco-General-Hospital.jpg'),
  'Landmark-General-Hospital': require('../assets/Hospitals/Landmark-General-Hospital.jpg'),
  'Samaritan-Surgical-Center': require('../assets/Hospitals/Samaritan-Surgical-Center.jpg'),
  'Nordic-Medical-Centre': require('../assets/Hospitals/Nordic-Medical-Centre.jpg'),
  'Myungsung-Christian-Medical-Center': require('../assets/Hospitals/Myungsung-Christian-Medical-Center.jpg'),
  // Add more images here
};

const About = () => {
  const hospitals = [
    { id: 1, name: "Bethzatha-General-Hospital", role: "Founded in May 2007, by the Kadisco group, the hospital is known for its objectives to secure the health of the society, through modern preventive and diagnostic health practices.With a wide range of medical equipment and several other facilities, the hospital’s specialties include general surgery, urology, dermatology, orthopedics, physiotherapy, dentistry, etc", img: "Bethzatha-General-Hospital" },
    { id: 2, name: "Hayat-Hospital", role: "A Norwegian facility run and staffed by highly experienced international and Ethiopian medical professionals, the hospital delivers high-quality medical services 24/7 with a focus on family and emergency medicine. The hospital has multiple departments which include general medicine, general surgery, pediatrics, psychology, and gynecology. ", img: "Hayat-Hospital" },
    { id: 3, name: "Kadisco-General-Hospital", role: "Established in September 1996, St Gabriel General Hospital is the first private hospital of its kind. Known for providing medical services 24 hours a day for all days of the week, the hospital has centered on thousands of patients from Ethiopia as well as the rest of the world. Some of the hospital’s specializations are general surgery, dermatology, orthopedics, ophthalmology, neurology, gynecology, physiotherapy.", img: "Kadisco-General-Hospital" },
    { id: 4, name: "Landmark-General-Hospital", role: "Founded in 2008, the hospital is known for providing high-quality medical care services to the people of the region. It is preferred by patients for its well-organized and friendly staff.", img: "Landmark-General-Hospital" },
    { id: 5, name: "Samaritan-Surgical-Center", role: "Known for providing the highest standard of care and first-class treatment, the hospital is known for striving to improve the healthcare service in Ethiopia.The hospital’s specialties are general surgery, orthopedics, neurosurgery, plastic surgery, etc", img: "Samaritan-Surgical-Center" },
    { id: 6, name: "Nordic-Medical-Centre", role: "A Norwegian facility run and staffed by highly experienced international and Ethiopian medical professionals, the hospital delivers high-quality medical services 24/7with a focus on family and emergency medicine.The hospital has multiple departments which include general medicine, general surgery, pediatrics, psychology, and gynecology.", img: "Nordic-Medical-Centre" },
    { id: 7, name: "Myungsung-Christian-Medical-Center", role: "Surgical Care, Endoscopic & Laparoscopic Surgery, Anesthesia, Opthalmology", img: "Myungsung-Christian-Medical-Center" },
  ];

  return (
    <ScrollView style={styles.container}>

       {/* About Us Section */}
       <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Our HealthCare System in Ethiopia</Text>
        <Text style={styles.aboutText}>
          Our hospital management system is designed to streamline operations, enhance patient care, 
          and improve overall efficiency. From scheduling appointments to managing patient records, 
          our system ensures seamless workflows for healthcare professionals and better experiences for patients.
        </Text>
        <View style={styles.row}>
          <View style={styles.aboutCard}>
            <Ionicons name="settings" size={32} color="#007bff" />
            <Text style={styles.aboutCardTitle}>Advanced Features</Text>
            <Text style={styles.aboutCardText}>Equipped with the latest technology to simplify hospital operations.</Text>
          </View>
          <View style={styles.aboutCard}>
            <Ionicons name="people" size={32} color="#007bff" />
            <Text style={styles.aboutCardTitle}>Patient-Centered</Text>
            <Text style={styles.aboutCardText}>Focusing on delivering better experiences and outcomes for patients.</Text>
          </View>
          <View style={styles.aboutCard}>
            <Ionicons name="shield-checkmark" size={32} color="#007bff" />
            <Text style={styles.aboutCardTitle}>Secure & Reliable</Text>
            <Text style={styles.aboutCardText}>Ensuring data security and system reliability at all times.</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  serviceDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  hospitalCard: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  hospitalImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  hospitalRole: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: 8,
  },
  doctorCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  doctorImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  doctorRole: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: 8,
  },
  lightBackground: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
  },
  aboutText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  aboutCard: {
    width: '100%',
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  aboutCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  aboutCardText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default About;