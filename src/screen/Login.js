import React, { useState, useEffect, useRef, useContext } from "react";
import { 
  View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, 
  ImageBackground, ActivityIndicator, Image, Pressable 
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import db from '../config/firestoreConfig'; 
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from './LanguageContext';

const Login = () => {
  const navigation = useNavigation();
  const { language, changeLanguage } = useContext(LanguageContext);
  const [loginMethod, setLoginMethod] = useState("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");   
  const [loading, setLoading] = useState(true);
  const [isLanguageDropdownVisible, setIsLanguageDropdownVisible] = useState(false);

  // Translation object
  const translations = {
    english: {
      login: "Login",
      continue: "Continue",
      continueWithEmail: "Continue with email",
      continueWithPhone: "Continue with phone",
      terms: "Terms and conditions",
      selectLanguage: "English",
      error: "Error",
      phoneRequired: "Please enter your phone number",
      emailRequired: "Please enter your email",
      inactiveUser: "Inactive User",
      verifyAccount: "You are not active. Please verify your account.",
      registrationSuccess: "Registration Successful",
      welcome: "Welcome!",
      loginError: "An error occurred during login"
    },
    amharic: {
      login: "ይግቡ",
      continue: "ይቀጥሉ",
      continueWithEmail: "በኢሜይል ይቀጥሉ",
      continueWithPhone: "በስልክ ቁጥር ይቀጥሉ",
      terms: "ውሎች እና ሁኔታዎች",
      selectLanguage: "አማርኛ",
      error: "ስህተት",
      phoneRequired: "እባክዎ ስልክ ቁጥርዎን ያስገቡ",
      emailRequired: "እባክዎ ኢሜይል አድራሻዎን ያስገቡ",
      inactiveUser: "ንቁ ያልሆነ ተጠቃሚ",
      verifyAccount: "ንቁ አይደለህም። እባክዎ መለያዎን ያረጋግጡ።",
      registrationSuccess: "ምዝገባ ተሳክቷል",
      welcome: "እንኳን ደህና መጡ!",
      loginError: "በመግቢያ ጊዜ ስህተት ተከስቷል"
    }
  };

  const t = translations[language];

  // Check stored phone number when the component is focused
  useFocusEffect(
    React.useCallback(() => {
      const checkStoredPhone = async () => {
        const storedPhone = await AsyncStorage.getItem('userPhone');
        if (storedPhone) {
          // Check if the phone number is active
          const userDocRef = doc(db, 'users', storedPhone);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            if (userData.status === "active") {
              // Navigate to Appointment if user is active
              navigation.navigate("Appointment", { phone: storedPhone });
              return;
            }
          }
        }
        setLoading(false); // End loading if user not found or inactive
      };

      checkStoredPhone();
    }, [navigation])
  );

  const handleLogin = async () => {
    if (loginMethod === "phone" && !phoneNumber) {
      Alert.alert(t.error, t.phoneRequired);
      return;
    }
    if (loginMethod === "email" && !email) {
      Alert.alert(t.error, t.emailRequired);
      return;
    }
  
    try {
      const identifier = loginMethod === "phone" ? phoneNumber : email;
      const userDocRef = doc(db, 'users', identifier);
      const docSnap = await getDoc(userDocRef);
  
      if (docSnap.exists()) {
        const userData = docSnap.data();
  
        if (userData.status !== "active") { // Check user status
          const otp = generateOTP(); // Generate OTP
          await setDoc(userDocRef, { ...userData, otp }, { merge: true }); // Store OTP in Firestore
  
          Alert.alert(t.inactiveUser, t.verifyAccount);
          navigation.navigate("OtpScreen", { identifier, otp }); // Navigate to OTP screen
          return;
        }
  
        console.log("User exists and is active, logging in...");
  
        if (loginMethod === "phone") {
          await AsyncStorage.setItem('userPhone', identifier);
        }
  
        navigation.navigate("Appointment", { [loginMethod]: identifier });
      } else {
        console.log("User does not exist, registering...");
        const otp = generateOTP(); // Generate OTP for new user
        await setDoc(userDocRef, {
          phone: loginMethod === "phone" ? identifier : null,
          email: loginMethod === "email" ? identifier : null,
          name: null,
          profilePicture: null,
          role: "customer", // Set default role to "customer"
          status: "inActive",
          createdAt: new Date().toISOString(),
          otp, // Save OTP in Firestore
        });
  
        if (loginMethod === "phone") {
          await AsyncStorage.setItem('userPhone', identifier);
        }
  
        Alert.alert(t.registrationSuccess, t.welcome);
        navigation.navigate("OtpScreen", { identifier, otp }); // Pass OTP to OTP screen
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert(t.error, error.message || t.loginError);
    }
  };
  
  // Function to generate a random 6-digit OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setIsLanguageDropdownVisible(false); // Close dropdown after selection
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownVisible(!isLanguageDropdownVisible);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ImageBackground 
        sou     rce={require('../../assets/images/background.png')}
        style={styles.container}
      >
    <Pressable style={styles.container} onPress={() => setIsLanguageDropdownVisible(false)}>
      
        {/* Language Dropdown */}
        <View style={styles.languageDropdownContainer}>
          <TouchableOpacity 
            onPress={toggleLanguageDropdown} 
            style={styles.languageButton}
          >
            <Text style={styles.languageButtonText}>{t.selectLanguage}</Text>
            <Ionicons 
              name={isLanguageDropdownVisible ? "chevron-up" : "chevron-down"} 
              size={16} 
              color="black" 
            />
          </TouchableOpacity>

          {isLanguageDropdownVisible && (
            <View style={styles.languageDropdownMenu}>
              <TouchableOpacity 
                onPress={() => handleLanguageChange("english")} 
                style={styles.languageOption}
              >
                <Text style={styles.languageOptionText}>English</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleLanguageChange("amharic")} 
                style={styles.languageOption}
              >
                <Text style={styles.languageOptionText}>አማርኛ</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo}
        />
        
        <Text style={styles.title}>{t.welcome}</Text>

        {/* Phone Number Input */}
        {loginMethod === "phone" && (
  <View style={styles.phoneInputContainer}>
    <PhoneInput
      defaultValue={phoneNumber}
      defaultCode="ET"
      layout="first"
      onChangeFormattedText={setPhoneNumber}
      containerStyle={styles.phoneInputContainerStyle}
      textContainerStyle={styles.phoneInputTextContainer}
      textInputStyle={styles.phoneInputText}
      codeTextStyle={styles.phoneInputCodeText}
    />
  </View>
)}

        {/* Email Input */}
        {loginMethod === "email" && (
          <>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="example@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </>
        )}

        {/* Custom Button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleLogin}>
          <Text style={styles.continueButtonText}>{t.continue}</Text>
        </TouchableOpacity>

        {/* "or" with horizontal lines */}
        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity 
          onPress={() => setLoginMethod(loginMethod === "phone" ? "email" : "phone")} 
          style={styles.emailButton}
        >
          <Text style={styles.emailButtonText}>
            {loginMethod === "phone" 
              ? t.continueWithEmail 
              : t.continueWithPhone}
          </Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>{t.terms}</Text>
    </Pressable>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  phoneInputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  phoneInputText: {
    fontSize: 16,
  },
  label: {
    marginVertical: 10,
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#000",
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "#000",
  },
  emailButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  emailButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  termsText: {
    textAlign: "center",
    fontSize: 14,
    color: "#6c757d",
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
    borderRadius: 5,
  },
  languageButtonText: {
    marginRight: 4,
    fontSize: 14,
  },
  languageDropdownMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  languageOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  languageOptionText: {
    fontSize: 14,
  },
  phoneInputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  phoneInputContainerStyle: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  phoneInputTextContainer: {
    backgroundColor: 'transparent',
  },
  phoneInputText: {
    height: 50,
    fontSize: 16,
  },
  phoneInputCodeText: {
    fontSize: 16,
  },
});

export default Login;