import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
<<<<<<< HEAD
  ScrollView,
  Alert,
  Modal,
  Picker
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
=======
  ImageBackground,
  FlatList,
  Modal,
  Alert,
  ScrollView,
  Button,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CountryPicker from 'react-native-country-picker-modal';
import axios from 'axios';
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
import { useNavigation } from '@react-navigation/native';

const PatientRegistration = () => {
  const [language, setLanguage] = useState('English');
<<<<<<< HEAD
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
=======
  const [isLanguageDropdownVisible, setIsLanguageDropdownVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  const [country, setCountry] = useState({
    cca2: 'ET',
    callingCode: ['251'],
    name: 'Ethiopia',
    flag: 'flag-et',
  });
  const [email, setEmail] = useState('');
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const navigation = useNavigation();
  
  const [formData, setFormData] = useState({
    phoneNumber: "",
    otp: "",
  });
  
  const [otpSent, setOtpSent] = useState(false);
  
  const translations = {
    English: {
      welcome: 'Welcome !',
      phonePlaceholder: 'Phone Number',
      continueButton: 'Continue',
      continueWithEmail: 'Continue with Email',
      selectLanguage: 'English',
      english: 'English',
      amharic: 'አማርኛ',
    },
    Amharic: {
      welcome: 'እንኳን �ደህና መጡ !',
      phonePlaceholder: 'ስልክ ቁጥር',
      continueButton: 'ቀጥል',
      continueWithEmail: 'በኢሜይል ይቀጥሉ',
      selectLanguage: 'አማርኛ',
      english: 'English',
      amharic: 'አማርኛ',
    },
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSendOtp = async () => {
    if (!formData.phoneNumber) {
      Alert.alert("Error", translations[language].phoneRequired);
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      Alert.alert("Error", translations[language].invalidPhone);
      return;
    }

    try {
      const fullPhoneNumber = `+${country.callingCode[0]}${formData.phoneNumber}`;
      const response = await axios.post("http://localhost:5000/api/send-otp", {
        phoneNumber: fullPhoneNumber,
      });
      Alert.alert("Success", response.data.message);
      setOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Error", "An error occurred while sending the OTP.");
    }
  };

  const handleSubmit = async () => {
    if (!formData.phoneNumber || !formData.otp) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(formData.otp)) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const fullPhoneNumber = `+${country.callingCode[0]}${formData.phoneNumber}`;
      const response = await axios.post("http://localhost:5000/api/verify-otp", {
        phoneNumber: fullPhoneNumber,
        otp: formData.otp,
      });
      Alert.alert("Success", response.data.message);
      navigation.navigate("Appointment", { patientId: response.data.patientId });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Error", error.response?.data?.message || "An error occurred while verifying the OTP.");
    }
  };

  const onSelectCountry = (country) => {
    setCountry(country);
    setCountryPickerVisible(false);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownVisible(!isLanguageDropdownVisible);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setIsLanguageDropdownVisible(false);
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

            {/* Phone Number Input with Country Picker */}
            <View style={styles.phoneInputContainer}>
              <TouchableOpacity
                style={styles.countryCodeContainer}
                onPress={() => setCountryPickerVisible(true)}
              >
                <CountryPicker
                  visible={countryPickerVisible}
                  withCallingCode
                  withFilter
                  withFlag
                  withEmoji
                  onSelect={onSelectCountry}
                  onClose={() => setCountryPickerVisible(false)}
                  countryCode={country.cca2}
                />
                <Text style={styles.countryCodeText}>+{country.callingCode[0]}</Text>
                <Ionicons name="chevron-down" size={12} color="black" />
              </TouchableOpacity>

              <TextInput
                style={styles.phoneInput}
                placeholder={translations[language].phonePlaceholder}
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                keyboardType="phone-pad"
                value={formData.phoneNumber}
                onChangeText={(text) => handleChange('phoneNumber', text)}
              />
            </View>

            {otpSent && (
              <>
                <Text style={styles.label}>OTP *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChangeText={(text) => handleChange('otp', text)}
                  keyboardType="number-pad"
                />
              </>
            )}

            {!otpSent ? (
              <TouchableOpacity style={styles.continueButton} onPress={handleSendOtp}>
                <Text style={styles.continueButtonText}>{translations[language].continueButton}</Text>
              </TouchableOpacity>
            ) : (
              <Button title="Submit" onPress={handleSubmit} />
            )}

            <View style={styles.orContainer}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.orLine} />
            </View>

            <TouchableOpacity 
              style={styles.signUpWithEmailButton} 
              onPress={() => setIsEmailModalVisible(true)}
            >
              <Ionicons name="mail" size={16} color="rgb(22, 22, 204)" style={styles.mailIcon} />
              <Text style={styles.signUpWithEmailButtonText}>
                {translations[language].continueWithEmail}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Terms and conditions</Text>
          <Text style={styles.footerText}> © 2025 care4you. All rights reserved</Text>
        </View>

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
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={() => {
                console.log('Email:', email);
                setIsEmailModalVisible(false);
              }}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </ImageBackground>
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
  );
};

const styles = StyleSheet.create({
<<<<<<< HEAD
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
=======
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  content: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 20,
    marginTop: 40,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  title: {
    color: 'rgb(8, 8, 8)',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  countryCodeText: {
    marginHorizontal: 5,
    fontSize: 14,
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: 'rgb(2, 2, 2)',
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
<<<<<<< HEAD
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
=======
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  orText: {
    marginHorizontal: 10,
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: 14,
  },
  signUpWithEmailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  mailIcon: {
    marginRight: 10,
  },
  signUpWithEmailButtonText: {
    color: 'rgb(0, 0, 0)',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  footerText: {
    color: 'rgb(3, 3, 3)',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
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
    fontSize: 12,
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
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  languageOptionText: {
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  emailInput: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: 'rgb(2, 2, 2)',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: 'black',
  },
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
});

export default PatientRegistration;