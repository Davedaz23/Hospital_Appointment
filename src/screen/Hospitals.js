
import { View, Text, Image, ImageBackground, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FooterMenu from './FooterMenu';
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

  // Translation object
  const translations = {
    english: {
      topHospitals: "Top Hospitals",
      registerNewHospital: "Register New Hospital",
      hospital1: "Bethzatha General Hospital",
      hospital1Desc: "Founded in May 2007, by the Kadisco group, the hospital is known for its objectives to secure the health of the society.",
      hospital2: "Hayat Hospital",
      hospital2Desc: "A Norwegian facility run and staffed by highly experienced international and Ethiopian medical professionals.",
      hospital3: "Kadisco General Hospital",
      hospital3Desc: "Established in September 1996, St Gabriel General Hospital is the first private hospital of its kind.",
      hospital4: "Landmark General Hospital",
      hospital4Desc: "Founded in 2008, the hospital is known for providing high-quality medical care services to the people of the region.",
      hospital5: "Samaritan Surgical Center",
      hospital5Desc: "Known for providing the highest standard of care and first-class treatment, the hospital is known for striving to improve the healthcare service in Ethiopia.",
      hospital6: "Nordic Medical Centre",
      hospital6Desc: "A Norwegian facility run and staffed by highly experienced international and Ethiopian medical professionals, the hospital delivers high-quality medical services 24/7 with a focus on family and emergency medicine.",
      hospital7: "Myungsung Christian Medical Center",
      hospital7Desc: "Surgical Care, Endoscopic & Laparoscopic Surgery, Anesthesia, Ophthalmology."
    },
    amharic: {
      topHospitals: "ከፍተኛ ሆስፒታሎች",
      registerNewHospital: "አዲስ ሆስፒታል ይመዝገቡ",
      hospital1: "ቤተ ዘታ ጄኔራል ሆስፒታል",
      hospital1Desc: "በመጋቢት 2007 በካዲስኮ ቡድን የተመሰረተው ይህ ሆስፒታል የህብረተሰቡን ጤና ለማስጠበቅ ያለው ዓላማ ይታወቃል።",
      hospital2: "ሀያት ሆስፒታል",
      hospital2Desc: "በኖርዌይ የሆነ ተቋም በብዙ ልምድ ያላቸው ዓለም አቀፍ እና ኢትዮጵያዊ የህክምና ባለሙያዎች የሚሠራ ሆስፒታል።",
      hospital3: "ካዲስኮ ጄኔራል ሆስፒታል",
      hospital3Desc: "በመስከረም 1996 የተመሰረተው ቅዱስ ገብርኤል ጄኔራል ሆስፒታል የመጀመሪያው የግል �ሃይል ሆስፒታል ነው።",
      hospital4: "ላንድማርክ ጄኔራል ሆስፒታል",
      hospital4Desc: "በ2008 የተመሰረተው ይህ ሆስፒታል ለክልሉ ህዝብ ከፍተኛ ጥራት ያለው የህክምና አገልግሎት ለመስጠት ይታወቃል።",
      hospital5: "ሳማሪታን የቀዶ ህክምና ማዕከል",
      hospital5Desc: "ከፍተኛ ደረጃ ያለው እንክብካቤ እና የመጀመሪያ ደረጃ ህክምና ለመስጠት የሚታወቀው ይህ ሆስፒታል በኢትዮጵያ ውስጥ የጤና አገልግሎትን ለማሻሻል ይሠራል።",
      hospital6: "ኖርዲክ ሜዲካል ማዕከል",
      hospital6Desc: "በኖርዌይ የሆነ ተቋም በብዙ ልምድ ያላቸው ዓለም አቀፍ እና ኢትዮጵያዊ የህክምና ባለሙያዎች የሚሠራ ሆስፒታል፣ 24/7 ከፍተኛ ጥራት ያለው የህክምና አገልግሎት ለቤተሰብ እና ለአደጋ ህክምና ትኩረት በመስጠት �ገልግሎት ይሰጣል።",
      hospital7: "ሚዩንግሰንግ ክርስትያን ሜዲካል ማዕከል",
      hospital7Desc: "የቀዶ ህክምና እንክብካቤ፣ ኢንዶስኮፒክ እና ላፓሮስኮፒክ ቀዶ ህክምና፣ አናስቴዥያ፣ የዓይን ህክምና።"
    },
  };

  const t = translations[language];

  // const hospitals = [
  //   { id: 1, name: t.hospital1, role: t.hospital1Desc, img: "Bethzatha-General-Hospital" },
  //   { id: 2, name: t.hospital2, role: t.hospital2Desc, img: "Hayat-Hospital" },
  //   { id: 3, name: t.hospital3, role: t.hospital3Desc, img: "Kadisco-General-Hospital" },
  //   { id: 4, name: t.hospital4, role: t.hospital4Desc, img: "Landmark-General-Hospital" },
  //   { id: 5, name: t.hospital5, role: t.hospital5Desc, img: "Samaritan-Surgical-Center" },
  //   { id: 6, name: t.hospital6, role: t.hospital6Desc, img: "Nordic-Medical-Centre" },
  //   { id: 7, name: t.hospital7, role: t.hospital7Desc, img: "Myungsung-Christian-Medical-Center" },

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

      {/* Scrollable Content */}

      {/* Background Watermark - Fixed Position */}
      <View style={styles.watermarkContainer}>
        <ImageBackground
          source={require('../assets/watermarkimage.jpg')}
          style={styles.watermark}
          resizeMode="center"
        />
      </View>
     

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
              {/* {isAdmin && (
                <TouchableOpacity
                  style={styles.registrationButton}
                  onPress={() => navigation.navigate('HospitalRegistration')}>
                  <Text style={styles.buttonText}>Register New Hospital</Text>
                </TouchableOpacity>
              )} */}

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
        watermarkContainer: {
          position: 'absolute',
        top: 100,
        left: 50,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1,
  },
        watermark: {
          width: '90%',
        height: '100%',
        opacity: 0.3,
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
        paddingTop: 20,
  },
        scrollContainer: {
          flexGrow: 1,
        padding: 16,
        paddingBottom: 80,
  },
        section: {
          marginBottom: 24,
        backgroundColor: 'transparent',

  },
        section: {
          padding: 16,

  },
        sectionTitle: {
          fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
        backgroundColor: 'transparent',
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
        shadowOffset: {width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        padding: 10,

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
        hospitalImage: {
          width: 80,
        height: 80,
        borderRadius: 8,
  },
        lightBackground: {
          padding: 16,

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
