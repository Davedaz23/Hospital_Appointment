import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image 
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { doc, getDoc, updateDoc,addDoc,collection,setDoc } from "firebase/firestore";
import db from '../config/firestoreConfig'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const OtpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { identifier } = route.params; // Get the identifier (phone or email)
  const [otp, setOtp] = useState("");
  const [fetchedOtp, setFetchedOtp] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', identifier);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFetchedOtp(data.otp); // Set the fetched OTP
          setUserData(data); // Set the fetched user data
        } else {
          Alert.alert("Error", "User not found.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, [identifier]);

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP.");
      return;
    }
  
    if (otp === fetchedOtp) {
      console.log("OTP verified successfully.");
  
      // Save the phone number in AsyncStorage
      await AsyncStorage.setItem('userPhone', identifier);
  
      const userDocRef = doc(db, 'users', identifier);
  
      // Update user status to active
      await updateDoc(userDocRef, { status: "active" });
  
      // Give 500 CareCoin
      const coinAmount = 500;
  
      try {
        // Record transaction in careCoins collection
        await addDoc(collection(db, 'careCoins'), {
          phoneNumber: identifier, // use phone as ID
          amount: coinAmount,
          type: 'earn',
          reason: 'OTP verification reward',
          createdAt: new Date()
        });
  
        // Update or create userCoins record
        const userCoinsRef = doc(db, 'userCoins', identifier);
        const userCoinsSnap = await getDoc(userCoinsRef);
  
        if (userCoinsSnap.exists()) {
          const currentCoins = userCoinsSnap.data().totalCoins || 0;
          await updateDoc(userCoinsRef, {
            totalCoins: currentCoins + coinAmount,
            lastUpdated: new Date()
          });
        } else {
          await setDoc(userCoinsRef, {
            totalCoins: coinAmount,
            lastUpdated: new Date()
          });
        }
  
        Alert.alert("Success", "OTP verified and 500 CareCoins awarded!");
        navigation.navigate("Appointment", { identifier });
  
      } catch (error) {
        console.error("Error awarding CareCoins:", error);
        Alert.alert("Error", "Something went wrong while awarding coins.");
      }
  
    } else {
      Alert.alert("Error", "Invalid OTP. Please try again.");
    }
  };
  

  return (
    <View style={styles.container}>
      {userData && (
        <>
          <Image source={{ uri: userData.profilePicture }} style={styles.profilePicture} />
          <Text style={styles.title}>Welcome, {userData.name}</Text>
          <Text style={styles.subTitle}>A verification code has been sent to {userData.email || userData.phone} {userData.otp}</Text>
        </>
      )}
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6} // Assuming OTP is 6 digits
      />

      <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOtp}>
        <Text style={styles.verifyButtonText}>Verify OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.resendButton}>
        <Text style={styles.resendButtonText}>Resend OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  verifyButton: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resendButton: {
    marginTop: 20,
    alignItems: "center",
  },
  resendButtonText: {
    color: "#007bff",
    fontWeight: "bold",
  },
});

export default OtpScreen;