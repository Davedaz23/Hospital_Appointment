import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Alert, RefreshControl, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PropTypes from "prop-types";
import FooterMenu from "./FooterMenu";
import { collection, query, where, getDocs, getDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../config/firestoreConfig'; // Firestore configuration
import AppointmentEditModal from "../components/appointmentEditModal"; // Import the EditModal component

const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phoneNumber);
};

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("today"); // default filter
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const storedPhone = await AsyncStorage.getItem('userPhone');
        if (storedPhone) {
          const cleanedPhone = storedPhone.slice(1).replace(/\D/g, '').trim();
          setPhoneNumber(`${cleanedPhone}`);
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

  const fetchHospitalName = async (hospitalID) => {
    try {
      const hospitalRef = doc(db, 'hospitals', hospitalID); // Create a DocumentReference for the hospital
      const hospitalDoc = await getDoc(hospitalRef); // Use getDoc to fetch the document
  
      // Check if the document exists
      return hospitalDoc.exists() ? hospitalDoc.data().name : "Unknown Hospital"; // Return hospital name or default message
    } catch (error) {
      console.error("Error fetching hospital name:", error);
      return "Unknown Hospital"; // Default return on error
    }
  };

  const fetchAppointments = async () => {
    if (!phoneNumber) return;

    if (!isValidPhoneNumber(phoneNumber)) {
      Alert.alert("Error", "Invalid phone number format.");
      return;
    }

    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(appointmentsRef, where('phoneNumber', '==', phoneNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const appointmentsList = await Promise.all(querySnapshot.docs.map(async (doc) => {
          const appointmentData = doc.data();
          const hospitalName = await fetchHospitalName(appointmentData.hospitalID);
          return {
            id: doc.id,
            ...appointmentData,
            hospitalName, // Add hospital name to the appointment
          };
        }));
        setAppointments(appointmentsList);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      Alert.alert("Error", "Failed to fetch appointments.");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [phoneNumber]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAppointments();
    setRefreshing(false);
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Appointment",
      "Are you sure you want to delete this appointment?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "appointments", id));
              Alert.alert("Success", "Appointment deleted successfully.");
              fetchAppointments();
            } catch (error) {
              console.error("Error deleting appointment:", error);
              Alert.alert("Error", "Failed to delete appointment.");
            }
          }
        }
      ]
    );
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  const handleSave = async (updatedAppointment) => {
    try {
      await setDoc(doc(db, "appointments", updatedAppointment.id), updatedAppointment);
      Alert.alert("Success", "Appointment updated successfully.");
      fetchAppointments(); // Refresh the appointments list
    } catch (error) {
      console.error("Error updating appointment:", error);
      Alert.alert("Error", "Failed to update appointment.");
    }
  };

  // ⬇️ Filter logic
  const filteredAppointments = appointments.filter((appointment) => {
    const appDate = new Date(appointment.app_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (filter === "previous") return appDate.setHours(0,0,0,0) < today;
    if (filter === "today") return appDate.toDateString() === today.toDateString();
    if (filter === "upcoming") return appDate.setHours(0,0,0,0) > today;
    return true;
  });

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.title}>Appointments</Text>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === "previous" && styles.activeFilter]}
            onPress={() => setFilter("previous")}
          >
            <Text style={styles.filterText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === "today" && styles.activeFilter]}
            onPress={() => setFilter("today")}
          >
            <Text style={styles.filterText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === "upcoming" && styles.activeFilter]}
            onPress={() => setFilter("upcoming")}
          >
            <Text style={styles.filterText}>Upcoming</Text>
          </TouchableOpacity>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, { flex: 2 }]}>Full Name</Text>
          <Text style={[styles.cell, { flex: 1 }]}>Hospital</Text>
          <Text style={styles.cell}>Date</Text>
          <Text style={styles.cell}>Actions</Text>
        </View>

        {/* Table Body */}
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <View key={appointment.id} style={styles.tableRow}>
              <Text style={[styles.cell, { flex: 2 }]}>{appointment.fullName}</Text>
              <Text style={[styles.cell, { flex: 1 }]}>{appointment.hospitalName}</Text>
              <Text style={styles.cell}>{new Date(appointment.app_date).toLocaleDateString()}</Text>
              <View style={[styles.cell, styles.actionCell]}>
                <TouchableOpacity onPress={() => handleEdit(appointment)} style={styles.actionButton}>
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(appointment.id)} style={[styles.actionButton, { backgroundColor: '#f44336' }]}>
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No appointments found.</Text>
        )}
      </ScrollView>

      {/* Edit Modal */}
      {selectedAppointment && (
        <AppointmentEditModal
          visible={modalVisible}
          appointment={selectedAppointment}
          onClose={() => setModalVisible(false)}
          onSave={handleSave}
        />
      )}

      <FooterMenu />
    </View>
  );
};

AppointmentList.propTypes = {
  route: PropTypes.object,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginVertical: 20 },

  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  filterButton: {
    flex: 1, // <-- this will make all buttons take equal space
    paddingVertical: 8,
    marginHorizontal: 5,
    backgroundColor: "#ccc",
    borderRadius: 5,
    alignItems: "center", // to center the text
  },
  activeFilter: {
    backgroundColor: "#2196F3",
  },
  filterText: {
    color: "#fff",
    fontWeight: "bold",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#ddd",
    padding: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc"
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "center"
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: "center"
  },
  actionCell: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5
  },
  actionButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginHorizontal: 2
  },
  actionText: {
    color: '#fff',
    fontSize: 12
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16
  }
});

export default AppointmentList;