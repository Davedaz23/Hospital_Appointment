import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import PropTypes from "prop-types";
import FooterMenu from "./FooterMenu";

// Phone number validation function
const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^[0-9]{10}$/; // Example: Adjust regex to match your phone number format
  return phoneRegex.test(phoneNumber);
};

const AppointmentList = ( {route} ) => {
  
  const { phoneNumber } = route.params; // Extract phoneNumber from route params
console.log(phoneNumber)

  const [appointments, setAppointments] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!phoneNumber) {
        Alert.alert("Error", "Phone number is not provided.");
        return;
      }

      // Validate phone number
      if (!isValidPhoneNumber(phoneNumber)) {
        Alert.alert("Error", "Invalid phone number format.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/appoints`, {
          params: { phoneNumber }, // Use the passed phoneNumber prop
        });

        console.log("API Response:", response.data);

        // Set the appointments in state only if they exist
        if (Array.isArray(response.data) && response.data.length > 0) {
          setAppointments(response.data.patientId);
        } else {
          Alert.alert("Info", "No appointments found for this phone number.");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error); // Log the error
        handleError(error);
      }
    };

    fetchAppointments();
  }, [phoneNumber]); // Fetch appointments when phoneNumber changes

  // Error handling function
  const handleError = (error) => {
    if (error.response) {
      console.error("Error fetching appointments:", error.response.data);
      Alert.alert("Error", error.response.data.error || "Failed to fetch appointments. Please try again later.");
    } else if (error.request) {
      console.error("No response received:", error.request);
      Alert.alert("Error", "No response from server. Please check your connection.");
    } else {
      console.error("Error setting up request:", error.message);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Appointment List</Text>
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <View key={appointment.id} style={styles.card}>
            <Text style={styles.cardTitle}>{appointment.fullName}</Text>
            <Text style={styles.cardText}>Email: {appointment.email}</Text>
            <Text style={styles.cardText}>Phone: {appointment.phoneNumber}</Text>
            <Text style={styles.cardText}>Hospital: {appointment.hospitalName || "N/A"}</Text>
            <Text style={styles.cardText}>Date: {new Date(appointment.app_date).toDateString()}</Text>
            <Text style={styles.cardText}>Address: {appointment.address}</Text>
            <Text style={styles.cardText}>Description: {appointment.description}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No appointments found.</Text>
      )}

<View style={styles.footer}>
        <FooterMenu />
      </View>
    </ScrollView>
  );
};

// Prop validation
AppointmentList.propTypes = {
  phoneNumber: PropTypes.string.isRequired,
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 5,
  },
  noDataText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60, // Set a fixed height for the footer
    backgroundColor: "white", // Ensure the footer has a background color
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
});

export default AppointmentList;