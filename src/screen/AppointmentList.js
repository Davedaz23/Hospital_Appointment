import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, StyleSheet, Alert, RefreshControl, TouchableOpacity, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FooterMenu from "./FooterMenu";
import { collection, query, where, getDocs, getDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../config/firestoreConfig';
import AppointmentEditModal from "../components/appointmentEditModal";
import { LanguageContext } from './LanguageContext';

const AppointmentList = () => {
  const { language } = useContext(LanguageContext);
  const [appointments, setAppointments] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("today");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  // Translation object
  const translations = {
    english: {
      title: "Appointments",
      previous: "Previous",
      today: "Today",
      upcoming: "Upcoming",
      fullName: "Full Name",
      hospital: "Hospital",
      date: "Date",
      cardNumber: "Card Number", // New translation for card number
      actions: "Actions",
      noData: "No appointments found",
      deleteTitle: "Delete Appointment",
      deleteMessage: "Are you sure you want to delete this appointment?",
      cancel: "Cancel",
      success: "Success",
      deleteSuccess: "Appointment deleted successfully",
      error: "Error",
      deleteError: "Failed to delete appointment",
      updateSuccess: "Appointment updated successfully",
      updateError: "Failed to update appointment",
      phoneError: "Phone number not found in storage",
      fetchError: "Failed to fetch phone number"
    },
    amharic: {
      title: "ቀጠሮዎች",
      previous: "ቀደምት",
      today: "ዛሬ",
      upcoming: "የሚመጡ",
      fullName: "ሙሉ ስም",
      hospital: "ሆስፒታል",
      date: "ቀን",
      cardNumber: "ካርድ ቁጥር", // New translation for card number
      actions: "ድርጊቶች",
      noData: "ምንም ቀጠሮዎች አልተገኙም",
      deleteTitle: "ቀጠሮ ሰርዝ",
      deleteMessage: "ይህን ቀጠሮ ለመሰረዝ እርግጠኛ ነዎት?",
      cancel: "ተው",
      success: "ተሳክቷል",
      deleteSuccess: "ቀጠሮው በተሳካ ሁኔታ ተሰርዟል",
      error: "ስህተት",
      deleteError: "ቀጠሮውን ለመሰረዝ አልተቻለም",
      updateSuccess: "ቀጠሮው በተሳካ ሁኔታ ተሻሽሏል",
      updateError: "ቀጠሮውን ለመሻሻል አልተቻለም",
      phoneError: "ስልክ ቁጥር አልተገኘም",
      fetchError: "ስልክ ቁጥር ማግኘት አልተቻለም"
    }
  };

  const t = translations[language];

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
            cardNumber: appointmentData.cardNumber??"NA" // Include card number

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
    {/* Background Watermark - Fixed Position */}
    <View style={styles.watermarkContainer}>
           <ImageBackground
              source={require('../assets/watermarkimage.jpg')}
              style={styles.watermark}
              resizeMode="center"
              />
            </View>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.title}>{t.title}</Text>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === "previous" && styles.activeFilter]}
            onPress={() => setFilter("previous")}
          >
            <Text style={styles.filterText}>{t.previous}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === "today" && styles.activeFilter]}
            onPress={() => setFilter("today")}
          >
            <Text style={styles.filterText}>{t.today}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === "upcoming" && styles.activeFilter]}
            onPress={() => setFilter("upcoming")}
          >
            <Text style={styles.filterText}>{t.upcoming}</Text>
          </TouchableOpacity>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>

          <Text style={[styles.cell, { flex: 2 }]}>{t.cardNumber}</Text>
          <Text style={[styles.cell, { flex: 2 }]}>{t.fullName}</Text>
          <Text style={[styles.cell, { flex: 1 }]}>{t.hospital}</Text>
          <Text style={styles.cell}>{t.date}</Text>
          <Text style={styles.cell}>{t.actions}</Text>
        </View>

             {/* Table Body */}
             {filteredAppointments.length > 0 ? (
  filteredAppointments.map((appointment) => (
    <View key={appointment.id} style={styles.tableRow}>
      <Text style={styles.cell}>{appointment.cardNumber ?? "NA"}</Text>
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
  <Text style={styles.noDataText}>{t.noData}</Text>
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

      <FooterMenu  />
    </View>
  );
};
// AppointmentList.propTypes = {
//   route: PropTypes.object,
// };
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    marginTop: 60,
    position: "relative",
    backgroundColor: "transparent" 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginVertical: 20 
  },
  watermarkContainer: {
    position: 'absolute',
    top: 100,
    left: 50,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  watermark: {
    width: '90%',
    height: '100%',
    opacity: 0.3,
  },
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
})

export default AppointmentList;