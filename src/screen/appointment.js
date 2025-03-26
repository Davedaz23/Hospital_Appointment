import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { Picker } from '@react-native-picker/picker';
import FooterMenu from "./FooterMenu";
import db from '../config/firestoreConfig'; // Import your Firestore configuration
import { collection, getDocs, query, where, setDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Appointment = () => {
  const navigation = useNavigation();

  // State for form data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    hospitalName: "",
    app_date: new Date(),
    address: "",
    description: "",
    hospitalID: "",
  });

  const [hospitals, setHospitals] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [language, setLanguage] = useState("english");

  // Language translations
  const translations = {
    english: {
      userProfileTitle: "User Profile",
      name: "Name",
      email: "Email",
      phone: "Phone",
      appointmentForm: "Appointment Form",
      fullName: "Full Name *",
      enterFullName: "Enter full name",
      enterEmail: "Enter email",
      enterPhoneNumber: "Enter phone number",
      selectHospital: "Select Hospital *",
      appointmentDate: "Appointment Date *",
      selectDate: "Select Date",
      selectedDate: "Selected Date",
      address: "Address",
      enterAddress: "Enter address",
      description: "Description",
      enterDescription: "Enter description",
      submit: "Submit",
    },
    amharic: {
      userProfileTitle: "የተጠቃሚ መግለጫ",
      name: "ስም",
      email: "ኢሜይል",
      phone: "ስልክ",
      appointmentForm: "የቀጠሮ ቅጽ",
      fullName: "ሙሉ ስም *",
      enterFullName: "ሙሉ ስም ያስገቡ",
      enterEmail: "ኢሜይል ያስገቡ",
      enterPhoneNumber: "ስልክ ቁጥር ያስገቡ",
      selectHospital: "ሆስፒታል ይምረጡ *",
      appointmentDate: "የቀጠሮ ቀን *",
      selectDate: "ቀን ይምረጡ",
      selectedDate: "የተመረጠ ቀን",
      address: "አድራሻ",
      enterAddress: "አድራሻ ያስገቡ",
      description: "መግለጫ",
      enterDescription: "መግለጫ ያስገቡ",
      submit: "አስገባ",
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchPhoneNumber();
      await fetchHospitals();
    };

    fetchData();
  }, []);

  const fetchPhoneNumber = async () => {
    try {
      const storedPhone = await AsyncStorage.getItem('userPhone');
      if (storedPhone) {
        const cleanedPhone = storedPhone.replace(/\D/g, '').trim();
        setFormData((prevData) => ({
          ...prevData,
          phoneNumber: cleanedPhone,
        }));
        await fetchUserProfile(cleanedPhone);
      } else {
        Alert.alert("Error", "Phone number not found in storage.");
      }
    } catch (error) {
      console.error("Error fetching phone number:", error);
    }
  };

  const fetchUserProfile = async (phone) => {
    try {
      const cleanedPhone = phone.replace(/\D/g, '').trim(); // Clean the phone number
      const formattedPhone = `+${cleanedPhone}`; // Prepend '+' to the cleaned phone
  
      const usersRef = collection(db, 'users');
      const userQuery = query(usersRef, where('phone', '==', formattedPhone));
      const querySnapshot = await getDocs(userQuery);
      
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setUserProfile(userData);
        setFormData((prevData) => ({
          ...prevData,
          fullName: userData.name || "",
          email: userData.email || "",
        }));
      } else {
        Alert.alert("Error", "User profile not found.");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      Alert.alert("Error", "Failed to fetch user profile.");
    }
  };

  const fetchHospitals = async () => {
    try {
      const hospitalsCollection = collection(db, 'hospitals');
      const hospitalSnap = await getDocs(hospitalsCollection);
      const hospitalsList = hospitalSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHospitals(hospitalsList);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      Alert.alert("Error", "Failed to fetch hospitals. Please try again later.");
    }
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (event, selectedDate) => {
    if (event.type === "set") {
      setShowDatePicker(false);
      if (selectedDate) {
        setFormData({ ...formData, app_date: selectedDate });
      }
    } else {
      setShowDatePicker(false);
    }
  };

  const validateForm = () => {
    const { fullName, phoneNumber, hospitalID } = formData;
    if (!fullName || !phoneNumber || !hospitalID) {
      Alert.alert("Error", "Please fill all required fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        app_date: formData.app_date.toISOString().split("T")[0],
      };
      console.log("Form Data:", payload);

      const appointmentsCollection = collection(db, 'appointments');
      await setDoc(doc(appointmentsCollection), payload);
      Alert.alert("Success", "Appointment created successfully.");
      navigation.navigate("AppointmentList", { patientId: payload.patientId });
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert("Error", "Failed to create appointment. Please try again.");
    }
  };

  const t = translations[language];

  return (
    <View style={styles.container}>
      <View style={styles.languageSelectorContainer}>
        <View style={styles.languageSelector}>
          <Picker
            selectedValue={language}
            onValueChange={(itemValue) => setLanguage(itemValue)}
            style={styles.languagePicker}
          >
            <Picker.Item label="English" value="english" />
            <Picker.Item label="አማርኛ" value="amharic" />
          </Picker>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
      >
        {userProfile && (
          <View style={styles.profileSection}>
            <Text style={styles.profileTitle}>{t.userProfileTitle}</Text>
            <Text style={styles.profileText}>{t.name}: {userProfile.fullName || "N/A"}</Text>
            <Text style={styles.profileText}>{t.email}: {userProfile.email || "N/A"}</Text>
            <Text style={styles.profileText}>{t.phone}: {formData.phoneNumber}</Text>
          </View>
        )}

        <Text style={styles.title}>{t.appointmentForm}</Text>

        <Text style={styles.label}>{t.fullName}</Text>
        <TextInput
          style={styles.input}
          placeholder={t.enterFullName}
          value={formData.fullName}
          onChangeText={(text) => handleChange("fullName", text)}
        />

        <Text style={styles.label}>{t.email}</Text>
        <TextInput
          style={styles.input}
          placeholder={t.enterEmail}
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
          keyboardType="email-address"
        />

        <Text style={styles.label}>{t.enterPhoneNumber}</Text>
        <TextInput
          style={styles.input}
          placeholder={t.enterPhoneNumber}
          value={formData.phoneNumber}
          editable={false}
        />

        <Text style={styles.label}>{t.selectHospital}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.hospitalID}
            onValueChange={(itemValue) => handleChange("hospitalID", itemValue)}
          >
            <Picker.Item label={t.selectHospital} value="" />
            {hospitals.map((hospital) => (
              <Picker.Item key={hospital.id} label={hospital.name} value={hospital.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>{t.appointmentDate}</Text>
        <Button
          title={t.selectDate}
          onPress={() => setShowDatePicker(true)}
        />
        {showDatePicker && (
          <DateTimePicker
            value={formData.app_date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <Text style={styles.dateText}>
          {t.selectedDate}: {formData.app_date.toDateString()}
        </Text>

        <Text style={styles.label}>{t.address}</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder={t.enterAddress}
          value={formData.address}
          onChangeText={(text) => handleChange("address", text)}
          multiline
        />

        <Text style={styles.label}>{t.description}</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder={t.enterDescription}
          value={formData.description}
          onChangeText={(text) => handleChange("description", text)}
          multiline
        />

        <Button title={t.submit} onPress={handleSubmit} />
      </ScrollView>

      <View style={styles.footer}>
        <FooterMenu />
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  languageSelectorContainer: {
    position: "absolute",
    top: 10,
    right: 30,
    zIndex: 1,
  },
  languageSelector: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  languagePicker: {
    height: 20,
    width: 70,
  },
  scrollView: {
    flex: 1,
    marginBottom: 60,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 80,
  },
  profileSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  profileText: {
    fontSize: 16,
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  dateText: {
    marginVertical: 10,
    fontSize: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
});

export default Appointment;