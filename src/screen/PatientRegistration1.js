import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  Modal,
  Picker
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const PatientRegistration = () => {
  const [language, setLanguage] = useState('English');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('ET');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigation = useNavigation();

  // Country data
  const countries = [
    { code: 'ET', dialCode: '251', name: 'Ethiopia' },
    { code: 'US', dialCode: '1', name: 'United States' },
    { code: 'GB', dialCode: '44', name: 'United Kingdom' },
    // Add more countries as needed
  ];

  const translations = {
    English: {
      welcome: 'Welcome!',
      phonePlaceholder: 'Phone Number',
      continueButton: 'Continue',
      selectCountry: 'Select Country',
    },
    Amharic: {
      welcome: 'እንኳን ደህና መጡ!',
      phonePlaceholder: 'ስልክ ቁጥር',
      continueButton: 'ቀጥል',
      selectCountry: 'ሀገር ይምረጡ',
    },
  };

  const handleSendOtp = () => {
    if (!phoneNumber) {
      Alert.alert("Error", "Please enter phone number");
      return;
    }
    // In a real app, you would call your API here
    setOtpSent(true);
    Alert.alert("OTP Sent", "Check your phone for OTP");
  };

  const handleSubmit = () => {
    if (!otp) {
      Alert.alert("Error", "Please enter OTP");
      return;
    }
    // In a real app, verify OTP with your backend
    navigation.navigate("Appointment");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Language Selector */}
      <View style={styles.languageSelector}>
        <TouchableOpacity onPress={() => setLanguage('English')}>
          <Text style={language === 'English' ? styles.activeLanguage : styles.language}>English</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setLanguage('Amharic')}>
          <Text style={language === 'Amharic' ? styles.activeLanguage : styles.language}>አማርኛ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>{translations[language].welcome}</Text>

        {/* Country Picker */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCountry}
            onValueChange={(itemValue) => setSelectedCountry(itemValue)}
            style={styles.picker}
          >
            {countries.map((country) => (
              <Picker.Item 
                key={country.code} 
                label={`${country.name} (+${country.dialCode})`} 
                value={country.code} 
              />
            ))}
          </Picker>
        </View>

        {/* Phone Input */}
        <TextInput
          style={styles.input}
          placeholder={translations[language].phonePlaceholder}
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        {otpSent && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
          </>
        )}

        {!otpSent && (
          <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
            <Text style={styles.buttonText}>{translations[language].continueButton}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  language: {
    marginLeft: 10,
    color: '#888',
  },
  activeLanguage: {
    marginLeft: 10,
    color: '#000',
    fontWeight: 'bold',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  button: {
    width: '100%',
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PatientRegistration;