import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ImageBackground, ActivityIndicator 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CountryPicker from "react-native-country-picker-modal";
import Icon from 'react-native-vector-icons/Ionicons'; 
import db from '../config/firestoreConfig'; 
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const navigation = useNavigation();
  const [loginMethod, setLoginMethod] = useState("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+251"); 
  const [country, setCountry] = useState({});
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const checkStoredPhone = async () => {
      const storedPhone = await AsyncStorage.getItem('userPhone');
      if (storedPhone) {
        navigation.navigate("Appointment", { phone: storedPhone });
      } else {
        setLoading(false); // Stop loading if no phone is found
      }
    };
    checkStoredPhone();
  }, [navigation]);

  const handleLogin = async () => {
    if (loginMethod === "phone" && !phoneNumber) {
      Alert.alert("Error", "Please enter your phone number.");
      return;
    }
    if (loginMethod === "email" && !email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    try {
      const identifier = loginMethod === "phone" 
        ? `${countryCode}${phoneNumber}` 
        : email;

      const userDocRef = doc(db, 'users', identifier);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        console.log("User exists, logging in...");
        navigation.navigate("Appointment", { [loginMethod]: identifier });
      } else {
        console.log("User does not exist, registering...");
        await setDoc(userDocRef, {
          phone: loginMethod === "phone" ? identifier : null,
          email: loginMethod === "email" ? identifier : null,
          name: null,
          profilePicture: null,
          role: "doctor",
          status: "inActive",
          createdAt: new Date().toISOString(),
        });
        
        // Store phone number in AsyncStorage
        if (loginMethod === "phone") {
          await AsyncStorage.setItem('userPhone', identifier);
        }

        Alert.alert("Registration Successful", "Welcome!");
        navigation.navigate("OtpScreen", { [loginMethod]: identifier }); // Navigate to OTP page
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", error.message || "An error occurred during login.");
    }
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
      source={require('../assets/background.png')} 
      style={styles.container}
    >
      <Image 
        source={require('../assets/logo.png')} 
        style={styles.logo}
      />
      
      <Text style={styles.title}>Login</Text>

      <View style={styles.languageContainer}>
        <Text style={styles.languageText}>English</Text>
      </View>

      {/* Phone Number Input */}
      {loginMethod === "phone" && (
        <View style={styles.phoneInputContainer}>
          <CountryPicker
            countryCode={country.cca2 || "ET"}
            withFlag
            withCallingCode
            withFilter
            onSelect={(selectedCountry) => {
              setCountry(selectedCountry);
              setCountryCode(`+${selectedCountry.callingCode[0]}`);
              setPhoneNumber(""); 
            }}
            containerStyle={styles.countryPicker}
          />
          <TouchableOpacity style={styles.chevronContainer}>
            <Icon name="chevron-down" size={20} color="#000" />
          </TouchableOpacity>
          
          <View style={styles.phoneInputWrapper}>
            <Text style={styles.countryCode}>{countryCode}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
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
        <Text style={styles.continueButtonText}>Continue</Text>
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
          {loginMethod === "phone" ? "Continue with email" : "Continue with phone"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.termsText}>Terms and conditions</Text>
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
    backgroundColor: "#fff", // Background color while loading
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
  languageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  languageText: {
    fontSize: 16,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  chevronContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  phoneInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingLeft: 10,
    flex: 1,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
    color: "#000",
  },
  label: {
    marginVertical: 10,
    fontSize: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: "#000", // Custom Button Color
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
    height: 3,
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
});

export default Login;