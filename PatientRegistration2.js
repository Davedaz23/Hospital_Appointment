import React, { useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Image,ImageBackground,FlatList,Modal,Alert,ScrollView,Button,} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import countries from 'country-data'; // Library for country data
import { Picker } from '@react-native-picker/picker';
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const PatientRegistration = () => {
  const [language, setLanguage] = useState('English');
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

  return (
    <ImageBackground source={require('../assets/background.png')} style={styles.backgroundImage}>
      <ScrollView style={styles.container}>
           <View style={styles.imageContainer}>
            <Image
              source={require('./assets/logo.png')} // Path to your logo image
              style={styles.image}
            />
          </View> 
          <Text style={styles.title}>{translations[language].welcome}</Text>

        {/* Phone Number */}
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="please Enter your phone number"
          value={formData.phoneNumber}
          onChangeText={(text) => handleChange('phoneNumber', text)}
          keyboardType="phone-pad"
        />

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
          <Button title="Continue" onPress={handleSendOtp} />
        ) : (
          <Button title="Submit" onPress={handleSubmit} />
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    //flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  container: {
    flex: 1,
    padding: 20,
    //backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: Add a semi-transparent background to make text more readable
  },
  image: {
    width: 80,
    height: 80,
  },
  imageContainer: {
    alignItems: 'center',
  },
  content: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#fff', // Optional: Add a background color to input fields
  },
});

export default PatientRegistration;