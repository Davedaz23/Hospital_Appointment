import React, { useContext } from 'react';
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

  // Translation object
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

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
         {/* Background Watermark - Fixed Position */}
           <View style={styles.watermarkContainer}>
              <ImageBackground
                source={require('../assets/watermarkimage.jpg')}
                style={styles.watermark}
                resizeMode="center"
                 />
             </View>
      {/* Coin Section */}
      <View style={styles.coinSection}>
        <Text style={[styles.coinTitle, isDarkMode && styles.darkText]}>{t.careCoins}</Text>
        <View style={styles.coinContainer}>
          <Ionicons name="logo-bitcoin" size={40} color="#FFD700" />
          <Text style={styles.coinAmount}>500</Text>
        </View>
      </View>

      <ScrollView style={styles.servicesContainer}>
        {/* Free Ambulance Section */}
        <TouchableOpacity style={[styles.serviceCard, isDarkMode && styles.darkCard]}>
          <Image 
            source={require('../assets/ambulance.png')} 
            style={styles.serviceImage}
          />
          <View style={styles.serviceTextContainer}>
            <Text style={[styles.serviceTitle, isDarkMode && styles.darkText]}>{t.freeAmbulance}</Text>
            <Text style={styles.serviceCost}>100 {t.coins}</Text>
          </View>
        </TouchableOpacity>

        {/* Loans Section */}
        <TouchableOpacity style={[styles.serviceCard, isDarkMode && styles.darkCard]}>
          <Image 
            source={require('../assets/loan.png')} 
            style={styles.serviceImage}
          />
          <View style={styles.serviceTextContainer}>
            <Text style={[styles.serviceTitle, isDarkMode && styles.darkText]}>{t.loans}</Text>
            <Text style={styles.serviceCost}>200 {t.coins}</Text>
          </View>
        </TouchableOpacity>

        {/* Full Check-up Section */}
        <TouchableOpacity style={[styles.serviceCard, isDarkMode && styles.darkCard]}>
          <Image 
            source={require('../assets/checkup.png')} 
            style={styles.serviceImage}
          />
          <View style={styles.serviceTextContainer}>
            <Text style={[styles.serviceTitle, isDarkMode && styles.darkText]}>{t.fullCheckup}</Text>
            <Text style={styles.serviceCost}>150 {t.coins}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Transfer Button */}
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
  Container: {
    flex: 1,
    backgroundColor: 'transparent',
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
    paddingTop: '20%'
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
    backgroundColor: 'transparent', // Use transparent to show the watermark below
   // borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
    //opacity: 0.3,
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