import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FooterMenu from './FooterMenu';
import { Ionicons } from '@expo/vector-icons';

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
  const [language, setLanguage] = useState("english");
  const [isLanguageDropdownVisible, setIsLanguageDropdownVisible] = useState(false);

  // Translation object
  const translations = {
    english: {
      topHospitals: "Top Hospitals",
      registerNewHospital: "Register New Hospital",
      selectLanguage: "English",
      english: "English",
      amharic: "አማርኛ",
    },
    amharic: {
      topHospitals: "ከፍተኛ ሆስፒታሎች",
      registerNewHospital: "አዲስ ሆስፒታል ይመዝገቡ",
      selectLanguage: "አማርኛ",
      english: "English",
      amharic: "አማርኛ",
    },
  };

  const hospitals = [
    { id: 1, name: "Bethzatha General Hospital", role: "Founded in May 2007, by the Kadisco group, the hospital is known for its objectives to secure the health of the society.", img: "Bethzatha-General-Hospital" },
    { id: 2, name: "Hayat Hospital", role: "A Norwegian facility run and staffed by highly experienced international and Ethiopian medical professionals.", img: "Hayat-Hospital" },
    { id: 3, name: "Kadisco General Hospital", role: "Established in September 1996, St Gabriel General Hospital is the first private hospital of its kind.", img: "Kadisco-General-Hospital" },
    { id: 4, name: "Landmark General Hospital", role: "Founded in 2008, the hospital is known for providing high-quality medical care services to the people of the region.", img: "Landmark-General-Hospital" },
    { id: 5, name: "Samaritan Surgical Center", role: "Known for providing the highest standard of care and first-class treatment, the hospital is known for striving to improve the healthcare service in Ethiopia.", img: "Samaritan-Surgical-Center" },
    { id: 6, name: "Nordic Medical Centre", role: "A Norwegian facility run and staffed by highly experienced international and Ethiopian medical professionals, the hospital delivers high-quality medical services 24/7 with a focus on family and emergency medicine.", img: "Nordic-Medical-Centre" },
    { id: 7, name: "Myungsung Christian Medical Center", role: "Surgical Care, Endoscopic & Laparoscopic Surgery, Anesthesia, Ophthalmology.", img: "Myungsung-Christian-Medical-Center" },
  ];

  const t = translations[language];

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownVisible(!isLanguageDropdownVisible);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setIsLanguageDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Language Selector */}
      <View style={styles.headerControls}>
        <View style={styles.languageDropdownContainer}>
          <TouchableOpacity 
            onPress={toggleLanguageDropdown} 
            style={styles.languageButton}
          >
            <Text style={styles.languageButtonText}>{t.selectLanguage}</Text>
            <Ionicons name="chevron-down" size={12} color="white" />
          </TouchableOpacity>

          {isLanguageDropdownVisible && (
            <View style={styles.languageDropdownMenu}>
              <TouchableOpacity 
                onPress={() => changeLanguage('english')} 
                style={styles.languageOption}
              >
                <Text style={styles.languageOptionText}>{t.english}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => changeLanguage('amharic')} 
                style={styles.languageOption}
              >
                <Text style={styles.languageOptionText}>{t.amharic}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
      >
        {/* Hospitals Section */}
        <View style={[styles.section, styles.lightBackground]}>
          <Text style={styles.sectionTitle}>{t.topHospitals}</Text>
          {hospitals.map((hospital) => (
            <View key={hospital.id} style={styles.hospitalContainer}>
              <Image
                source={hospitalImages[hospital.img]}
                style={styles.hospitalImage}
              />
              <View style={styles.hospitalTextContainer}>
                <Text style={styles.hospitalName}>{hospital.name}</Text>
                <Text style={styles.hospitalRole}>{hospital.role}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      
      {/* Button to navigate to Hospital Registration */}
      <TouchableOpacity
        style={styles.registrationButton}
        onPress={() => navigation.navigate('HospitalRegistration')}
      >
        <Text style={styles.buttonText}>{t.registerNewHospital}</Text>
      </TouchableOpacity>

      {/* Fixed Footer Menu */}
      <View style={styles.footer}>
        <FooterMenu />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  headerControls: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  languageDropdownContainer: {
    zIndex: 1,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#2196F3',
    borderRadius: 6,
  },
  languageButtonText: {
    marginRight: 4,
    fontSize: 12,
    color: 'white',
  },
  languageDropdownMenu: {
    position: 'absolute',
    top: 32,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    minWidth: 100,
  },
  languageOption: {
    paddingVertical: 4,
  },
  languageOptionText: {
    fontSize: 12,
  },
  registrationButton: {
    position: 'absolute',
    bottom: 70,
    left: 20,
    right: 20,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    marginBottom: 60,
    paddingTop: 50, // Added to make space for language selector
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 80,
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
  hospitalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
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
    fontSize: 12,
    fontWeight: 'bold',
  },
  hospitalRole: {
    fontSize: 10,
    color: '#663',
    maxHeight: 150,
    overflow: 'scroll',
  },
  hospitalImage: {
    width: 80,
    maxHeight: 80,
    borderRadius: 8,
  },
  lightBackground: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
});

export default Hospitals;