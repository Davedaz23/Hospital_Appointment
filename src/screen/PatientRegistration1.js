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
  ScrollView,
  Button,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import countries from 'country-data'; // Library for country data
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

// Get all countries with flags and codes
const allCountries = countries.countries.all.map((country) => ({
  name: country.name,
  code: country.countryCallingCodes[0],
  flag: country.emoji,
}));

const PatientRegistration = () => {
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

  // Filter countries based on search query
  const filteredCountries = allCountries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    otp: "",
  });
  
  const [otpSent, setOtpSent] = useState(false);
  
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

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSendOtp = async () => {
    // Validate required fields
    if (!formData.phoneNumber) {
      Alert.alert("Error", "Please enter your phone number.");
      return;
    }

    // Validate phone number format
    const phoneRegex = /^\d{10}$/; // Assuming a 10-digit phone number
    if (!phoneRegex.test(formData.phoneNumber)) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/send-otp", {
        phoneNumber: formData.phoneNumber,
      });
      Alert.alert("Success", response.data.message);
      setOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Error", "An error occurred while sending the OTP.");
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (
      
      !formData.phoneNumber ||
  
      !formData.otp
    ) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    // Validate OTP format
    const otpRegex = /^\d{6}$/; // 6-digit OTP
    if (!otpRegex.test(formData.otp)) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/verify-otp", {
        phoneNumber: formData.phoneNumber,
        otp: formData.otp,
       
      });
      Alert.alert("Success", response.data.message);

      // Navigate to the Appointment page with patientId
      navigation.navigate("Appointment", { patientId: response.data.patientId });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Error", "An error occurred while verifying the OTP.");
    }
  };

  // Handle continue button press
  const handleContinue = () => {
    // Add your logic to handle the phone number submission
    console.log('Phone Number:', countryCode + phoneNumber);
    // You can navigate to the next screen or perform any other action here
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
    <ImageBackground source={require('../assets/background.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
            <Image source={require('../assets/logo.png')} style={styles.image} />
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
                value={formData.phoneNumber}
                onChangeText={(text) => handleChange('phoneNumber', text)}
              />
            </View>
          </View>

          {/* OTP */}
          {otpSent && (
            <>
              <Text style={styles.label}>OTP *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit OTP "
                value={formData.otp}
                onChangeText={(text) => handleChange('otp', text)}
                keyboardType="number-pad"
              />
            </>
          )}

          {/* Buttons */}
          {!otpSent ? (
            <TouchableOpacity style={styles.continueButton} onPress={handleSendOtp}>
              <Text style={styles.continueButtonText}>{translations[language].continueButton}</Text>
            </TouchableOpacity>
          ) : (
            <Button title="Submit" onPress={handleSubmit} />
          )}

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
        </ScrollView>

        {/* Footer */}
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
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  content: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between', // Ensures footer stays at the bottom
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
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
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: Add a semi-transparent background
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
    fontWeight: 'bold',
  },
});

export default PatientRegistration;