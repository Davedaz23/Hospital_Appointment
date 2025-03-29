import React, { useState, useEffect, useRef } from "react";
import { 
  View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ImageBackground, ActivityIndicator, Image 
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import PhoneInput from 'react-native-phone-input';
import db from '../config/firestoreConfig'; 
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const navigation = useNavigation();
  const [loginMethod, setLoginMethod] = useState("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");   
  const [loading, setLoading] = useState(true);
  const phoneInputRef = useRef(null);

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
      Alert.alert("Error", "Please enter your phone number.");
      return;
    }
    if (loginMethod === "email" && !email) {
      Alert.alert("Error", "Please enter your email.");
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
  
          Alert.alert("Inactive User", "You are not active. Please verify your account.");
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
  
        Alert.alert("Registration Successful", "Welcome!");
        navigation.navigate("OtpScreen", { identifier, otp }); // Pass OTP to OTP screen
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", error.message || "An error occurred during login.");
    }
  };
  
  
  // Function to generate a random 6-digit OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
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
          <PhoneInput
            ref={phoneInputRef}
            initialCountry="et"
            onChangePhoneNumber={setPhoneNumber}
            style={styles.input}
            textStyle={styles.phoneInputText}
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
  languageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  languageText: {
    fontSize: 16,
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