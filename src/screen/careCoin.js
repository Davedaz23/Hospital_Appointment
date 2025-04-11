import React, { useContext, useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import app from '../config/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import applyForService from '../services/applyForService';

import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from './LanguageContext';
import { useTheme } from '../theme/ThemeContext';

const CareCoin = ({ navigation }) => {
  const { language } = useContext(LanguageContext);
  const { isDarkMode } = useTheme();
  const [coinBalance, setCoinBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  const db = getFirestore(app);

  const translations = {
    english: {
      careCoins: "Your Care Coins",
      freeAmbulance: "Free Ambulance for Pregnant Women",
      loans: "Emergency Loans",
      fullCheckup: "Full Medical Check-up",
      transferCoins: "Transfer Coins",
      coins: "Coins",
    },
    amharic: {
      careCoins: "ኬር ኮይን",
      freeAmbulance: "ለእርጉ ሴት ነፃ አምቡላንስ",
      loans: "ብድር",
      fullCheckup: "ሙሉ የህክምና ምርመራ",
      transferCoins: "ኮይን ይላኩ",
      coins: "ኮይኖች",
    },
  };

  const t = translations[language];

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true); // Start loading
      try {
        const storedPhone = await AsyncStorage.getItem('userPhone');
        if (!storedPhone) {
          console.log('No user found');
          setCoinBalance(0);
          return;
        }

        const cleanedPhone = storedPhone.replace(/\D/g, '').trim(); // Remove non-numeric characters
        const phoneWithPlus = `+${cleanedPhone}`; // Format with '+'

        // Query for both phone formats
        const coinsQuery = query(
          collection(db, 'careCoins'),
          where('phoneNumber', 'in', [cleanedPhone, phoneWithPlus])
        );

        const querySnapshot = await getDocs(coinsQuery);
        let totalCoins = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log(data);
          totalCoins += data.amount || 0; // Sum up the amounts
        });

        setCoinBalance(totalCoins || 0); // Set total coins or 0 if none found
      } catch (error) {
        console.error('Error fetching Care Coins:', error);
        setCoinBalance(0); // Handle error
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchCoins(); // Fetch coins on component mount
  }, []);

  const services = [
    {
      name: t.freeAmbulance,
      image: require('../assets/ambulance.png'),
      coinRequired: 100,
      serviceType: 'ambulance',
    },
    {
      name: t.loans,
      image: require('../assets/loan.png'),
      coinRequired: 200,
      serviceType: 'loan',
    },
    {
      name: t.fullCheckup,
      image: require('../assets/checkup.png'),
      coinRequired: 150,
      serviceType: 'checkup',
    },
  ];

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.watermarkContainer}>
        <ImageBackground
          source={require('../assets/watermarkimage.jpg')}
          style={styles.watermark}
          resizeMode="center"
        />
      </View>

      <View style={styles.coinSection}>
        <Text style={[styles.coinTitle, isDarkMode && styles.darkText]}>
          {t.careCoins}
        </Text>
        <View style={styles.coinContainer}>
          <Ionicons name="logo-bitcoin" size={40} color="#FFD700" />
          <Text style={styles.coinAmount}>
            {loading ? '...' : coinBalance !== null ? coinBalance : '0'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.servicesContainer}>
        {services.map((service, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.serviceCard, isDarkMode && styles.darkCard]}
            onPress={() => applyForService(service.serviceType)}
          >
            <Image source={service.image} style={styles.serviceImage} />
            <View style={styles.serviceTextContainer}>
              <Text style={[styles.serviceTitle, isDarkMode && styles.darkText]}>
                {service.name}
              </Text>
              <Text style={styles.serviceCost}>
                {service.coinRequired} {t.coins}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.transferButton}
        onPress={() => navigation.navigate('TransferCoin')}
      >
        <Text style={styles.transferButtonText}>{t.transferCoins}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  darkContainer: {
    backgroundColor: '#121212',
  },
  darkText: {
    color: '#fff',
  },
  coinSection: {
    backgroundColor: '#2196F3',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    paddingTop: '20%',
  },
  coinTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 50,
    width: 150,
  },
  coinAmount: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  servicesContainer: {
    flex: 1,
    padding: 15,
  },
  serviceCard: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#333',
  },
  serviceImage: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  serviceTextContainer: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  serviceCost: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  transferButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  transferButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CareCoin;