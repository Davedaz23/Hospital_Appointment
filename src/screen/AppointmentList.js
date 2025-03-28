import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Alert, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PropTypes from "prop-types";
import FooterMenu from "./FooterMenu";
import { collection, query, where, getDocs } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../config/firestoreConfig'; // Import your Firestore configuration

// Phone number validation function
const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\+?[0-9]{10,15}$/; // Adjust regex for international phone formats
  return phoneRegex.test(phoneNumber);
};

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const storedPhone = await AsyncStorage.getItem('userPhone');
        if (storedPhone) {
          const cleanedPhone = storedPhone.slice(1).replace(/\D/g, '').trim(); // Remove the first character and clean the phone number
          setPhoneNumber(`+${cleanedPhone}`); // Prepend '+' to the cleaned phone
        } else {
          Alert.alert("Error", "Phone number not found in storage.");
        }
      } catch (error) {
        console.error("Error fetching phone number:", error);
        Alert.alert("Error", "Failed to fetch phone number.");
      }
    };

    fetchPhoneNumber();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!phoneNumber) return; // Wait for phone number to be set

      // Validate phone number
      if (!isValidPhoneNumber(phoneNumber)) {
        Alert.alert("Error", "Invalid phone number format.");
        return;
      }

      try {
        const appointmentsRef = collection(db, 'appointments');
        const q = query(appointmentsRef, where('phoneNumber', '==', phoneNumber)); // Use phoneNumber directly
        const querySnapshot = await getDocs(q);

        // Check if appointments exist
        if (!querySnapshot.empty) {
          const appointmentsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAppointments(appointmentsList);
        } else {
          Alert.alert("Info", "No appointments found for this phone number. ");
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
    console.error("Error fetching appointments:", error);
    Alert.alert("Error", "Failed to fetch appointments. Please try again later.");
  };

  // Function to refresh the appointment list
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAppointments(); // Call the fetchAppointments function to refresh data
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
      </ScrollView>

      <View style={styles.footer}>
        <FooterMenu />
      </View>
    </View>
  );
};

// Prop validation
AppointmentList.propTypes = {
  route: PropTypes.object,
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between", // Ensure footer stays at bottom
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1, // Allows ScrollView to take up remaining space
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
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
});

export default AppointmentList;