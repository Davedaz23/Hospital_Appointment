import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import countries from 'country-data'; // Library for country data
import axios from 'axios'; // For making HTTP requests

// Get all countries with flags and codes
const allCountries = countries.countries.all.map((country) => ({
  name: country.name,
  code: country.countryCallingCodes[0],
  flag: country.emoji,
}));

const PatientRegistration = ({ navigation }) => {
  const [language, setLanguage] = useState('English'); // State for selected language
  const [isLanguageDropdownVisible, setIsLanguageDropdownVisible] = useState(false); // State for language dropdown visibility
  const [countryCode, setCountryCode] = useState('+251'); // State for selected country code
  const [phoneNumber, setPhoneNumber] = useState(''); // State for phone number
  const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false); // State for country picker visibility
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [selectedCountry, setSelectedCountry] = useState({
    name: 'Ethiopia',
    code: '+251',
    flag: '🇪🇹',
  }); // State for selected country
  const [email, setEmail] = useState(''); // State for email
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false); // State for email modal visibility
  const [otp, setOtp] = useState(''); // State for OTP
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false); // State for OTP modal visibility

  // Filter countries based on search query
  const filteredCountries = allCountries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Translation object
  const translations = {
    English: {
      welcome: 'Welcome !',
      phonePlaceholder: 'Phone Number',
      continueButton: 'Continue',
      continueWithEmail: 'Continue with Email',
      forgotPassword: 'Forgot Password?',
      createAccount: 'Create Account',
      noAccount: "Don't have an account?",
      careForYou: 'CARE FOR YOU',
      selectLanguage: 'English',
      english: 'English',
      amharic: 'አማርኛ',
    },
    Amharic: {
      welcome: 'እንኳን ደህና መጡ !',
      phonePlaceholder: 'ስልክ ቁጥር',
      continueButton: 'ቀጥል',
      continueWithEmail: 'በኢሜይል ይቀጥሉ',
      forgotPassword: 'የይለፍ ቃል ረስተዋል?',
      createAccount: 'መለያ ፍጠር',
      noAccount: 'መለያ ይሎትም?',
      careForYou: 'CARE FOR YOU',
      selectLanguage: 'አማርኛ',
      english: 'English',
      amharic: 'አማርኛ',
    },
  };

  // Toggle language dropdown visibility
  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownVisible(!isLanguageDropdownVisible);
  };

  // Change language
  const changeLanguage = (lang) => {
    setLanguage(lang);
    setIsLanguageDropdownVisible(false); // Close dropdown after selection
  };

  // Handle country selection
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setCountryCode(country.code);
    setIsCountryPickerVisible(false);
  };

  // Handle continue button press
  const handleContinue = async () => {
    const fullPhoneNumber = countryCode + phoneNumber;

    try {
      // Send OTP to the backend
      const response = await axios.post('http://localhost:5000/api/send-otp', {
        phoneNumber: fullPhoneNumber,
      });

      if (response.data.message === 'OTP sent successfully') {
        setIsOtpModalVisible(true); // Show OTP input modal
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    }
  };

  // Handle OTP verification
  const handleOtpVerification = async () => {
    const fullPhoneNumber = countryCode + phoneNumber;

    try {
      const response = await axios.post('http://localhost:5000/api/verify-otp', {
        phoneNumber: fullPhoneNumber,
        otp,
      });

      if (response.data.message === 'Patient registered successfully!') {
        navigation.navigate('MainContent'); // Navigate to the main content screen
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    }
  };

  // Handle continue with email button press
  const handleContinueWithEmail = () => {
    setIsEmailModalVisible(true); // Show the email input modal
  };

  // Handle email submission
  const handleEmailSubmit = () => {
    // Add your logic to handle the email submission
    console.log('Email:', email);
    setIsEmailModalVisible(false); // Close the modal after submission
    // You can navigate to the next screen or perform any other action here
  };

  return (
    <ImageBackground
      source={require('./assets/background.png')} // Path to your background image
      style={styles.background}
      resizeMode="cover" // Ensures the image covers the entire screen
    >
      <View style={styles.container}>
        {/* Language Dropdown */}
        <View style={styles.languageDropdownContainer}>
          <TouchableOpacity onPress={toggleLanguageDropdown} style={styles.languageButton}>
            <Text style={styles.languageButtonText}>{translations[language].selectLanguage}</Text>
            <Ionicons name="chevron-down" size={12} color="black" />
          </TouchableOpacity>

          {isLanguageDropdownVisible && (
            <View style={styles.languageDropdownMenu}>
              <TouchableOpacity onPress={() => changeLanguage('English')} style={styles.languageOption}>
                <Text style={styles.languageOptionText}>{translations[language].english}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeLanguage('Amharic')} style={styles.languageOption}>
                <Text style={styles.languageOptionText}>{translations[language].amharic}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              source={require('./assets/logo.png')} // Path to your logo image
              style={styles.image}
            />
          </View>
          <Text style={styles.title}>{translations[language].welcome}</Text>

          {/* Country Code and Phone Number Input */}
          <View style={styles.phoneInputContainer}>
            <TouchableOpacity
              style={styles.countryCodeContainer}
              onPress={() => setIsCountryPickerVisible(true)}
            >
              <Text style={styles.flag}>{selectedCountry.flag}</Text>
              <Ionicons name="chevron-down" size={12} color="black" />
            </TouchableOpacity>
            
            <View style={styles.phoneInput}>
              <Text>{selectedCountry.code}</Text>
              <TextInput
                placeholder={translations[language].phonePlaceholder}
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>{translations[language].continueButton}</Text>
          </TouchableOpacity>

          {/* OR Divider */}
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          {/* Sign Up with Email Button */}
          <TouchableOpacity style={styles.signUpWithEmailButton} onPress={handleContinueWithEmail}>
            <Ionicons name="mail" size={16} color="rgb(22, 22, 204)" style={styles.mailIcon} />
            <Text style={styles.signUpWithEmailButtonText}>
              {translations[language].continueWithEmail}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer Text */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Terms and conditions</Text>
          <Text style={styles.footerText}> © 2025 care4you. All rights reserved</Text>
        </View>

        {/* Country Picker Modal */}
        <Modal
          visible={isCountryPickerVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setIsCountryPickerVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search for a country"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => handleCountrySelect(item)}
                >
                  <Text style={styles.flag}>{item.flag}</Text>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.countryCode}>{item.code}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>

        {/* Email Input Modal */}
        <Modal
          visible={isEmailModalVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setIsEmailModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter Your Email</Text>
            <TextInput
              style={styles.emailInput}
              placeholder="Email Address"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleEmailSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* OTP Input Modal */}
        <Modal
          visible={isOtpModalVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setIsOtpModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter OTP</Text>
            <TextInput
              style={styles.emailInput}
              placeholder="OTP"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
              keyboardType="numeric"
              value={otp}
              onChangeText={setOtp}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleOtpVerification}>
              <Text style={styles.submitButtonText}>Verify OTP</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  content: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
  },
  image: {
    width: 80,
    height: 80,
  },
  imageContainer: {
    alignItems: 'center',
  },
  title: {
    color: 'rgb(8, 8, 8)',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  phoneInput: {
    backgroundColor: 'white',
    flex: 1,
    height: 40,
    borderColor: 'rgb(255, 255, 255)',
    borderWidth: 0,
    borderBottomWidth: 1,
    paddingHorizontal: 8,
    color: 'black',
    fontSize: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  continueButton: {
    backgroundColor: 'rgb(2, 2, 2)',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 0,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  orText: {
    marginHorizontal: 8,
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: 10,
  },
  signUpWithEmailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 5,
    borderWidth: 0,
    marginBottom: 16,
  },
  mailIcon: {
    color: 'rgb(0, 0, 0)',
    marginRight: 8,
  },
  signUpWithEmailButtonText: {
    color: 'rgb(0, 0, 0)',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgb(3, 3, 3)',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 4,
  },
  countryCodeContainer: {
    maxWidth: 60,
    backgroundColor: 'white',
    flex: 1,
    height: 40,
    borderColor: 'rgb(255, 255, 255)',
    borderWidth: 0,
    borderBottomWidth: 1,
    color: 'black',
    fontSize: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 12,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  flag: {
    fontSize: 14,
    marginRight: 4,
  },
  countryCodeText: {
    fontSize: 12,
    marginRight: 4,
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  searchBar: {
    height: 36,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 8,
    fontSize: 10,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  countryName: {
    flex: 1,
    fontSize: 10,
  },
  countryCode: {
    fontSize: 10,
  },
  languageDropdownContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 6,
  },
  languageButtonText: {
    marginRight: 4,
    fontSize: 10,
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
  },
  languageOption: {
    paddingVertical: 4,
  },
  languageOptionText: {
    fontSize: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  emailInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: 'rgb(2, 2, 2)',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 12,
  },
});

export default PatientRegistration;