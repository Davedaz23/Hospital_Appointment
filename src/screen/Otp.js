import React, { useState } from "react";
import { 
  View, Text, TextInput, StyleSheet, Alert, TouchableOpacity 
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const OtpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { identifier } = route.params; // Get the identifier (phone or email)
  const [otp, setOtp] = useState("");

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP.");
      return;
    }

    // Simulated OTP verification (replace with your actual logic)
    const isValidOtp = otp === "123456"; // Example: static OTP for testing

    if (isValidOtp) {
      console.log("OTP verified successfully.");
      navigation.navigate("Appointment", { identifier });
    } else {
      Alert.alert("Error", "Invalid OTP. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subTitle}>A verification code has been sent to {identifier}</Text>

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
    backgroundColor: "#fff", // Solid background color
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
    backgroundColor: "#000", // Custom Button Color
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