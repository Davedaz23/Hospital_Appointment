import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Picker } from '@react-native-picker/picker'; // Import Picker
import FooterMenu from "./FooterMenu";

const Appointment = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { patientId } = route.params;

  // State for form data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    hospitalName: "",
    app_date: new Date(), // Use Date object for better handling
    address: "",
    description: "",
    patientId: patientId,
    hospitalID: "", // Hospital ID from the dropdown
  });

  const [hospitals, setHospitals] = useState([]); // List of hospitals
  const [showDatePicker, setShowDatePicker] = useState(false); // Control date picker visibility

  // Fetch hospitals on component mount
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/hospitals");
        setHospitals(response.data.hospitals);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
        Alert.alert("Error", "Failed to fetch hospitals. Please try again later.");
      }
    };

    fetchHospitals();
  }, []);

  // Handle form input changes
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle date change from DateTimePicker
  const handleDateChange = (event, selectedDate) => {
    if (event.type === "set") {
      setShowDatePicker(false); // Hide picker after selection
      if (selectedDate) {
        setFormData({ ...formData, app_date: selectedDate });
      }
    } else {
      setShowDatePicker(false); // Hide picker if canceled
    }
  };

  // Validate form data
  const validateForm = () => {
    const { fullName, phoneNumber, hospitalID } = formData;
    if (!fullName || !phoneNumber || !hospitalID) {
      Alert.alert("Error", "Please fill all required fields.");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        app_date: formData.app_date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
      };
      console.log("Form Data:", payload);  // Log payload data to console before sending the request

      const response = await axios.post("http://localhost:5000/api/appoints", payload);
      Alert.alert("Success", response.data.message);
      navigation.navigate("AppointmentList", { patientId: response.data.patientId });
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert("Error", "Failed to create appointment. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView} // Apply style to ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true} // Make the scrollbar visible
      >
        <Text style={styles.title}>Appointment Form</Text>

        {/* Full Name */}
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter full name"
          value={formData.fullName}
          onChangeText={(text) => handleChange("fullName", text)}
        />

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
          keyboardType="email-address"
        />

        {/* Phone Number */}
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          value={formData.phoneNumber}
          onChangeText={(text) => handleChange("phoneNumber", text)}
          keyboardType="phone-pad"
        />

        {/* Hospital Selection */}
        <Text style={styles.label}>Select Hospital *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.hospitalID}
            onValueChange={(itemValue) => handleChange("hospitalID", itemValue)}
          >
            <Picker.Item label="Select a hospital" value="" />
            {hospitals.map((hospital) => (
              <Picker.Item key={hospital.id} label={hospital.name} value={hospital.id} />
            ))}
          </Picker>
        </View>

        {/* Appointment Date */}
        <Text style={styles.label}>Appointment Date *</Text>
        <Button
          title="Select Date"
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
          Selected Date: {formData.app_date.toDateString()}
        </Text>

        {/* Address */}
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Enter address"
          value={formData.address}
          onChangeText={(text) => handleChange("address", text)}
          multiline
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Enter description"
          value={formData.description}
          onChangeText={(text) => handleChange("description", text)}
          multiline
        />

        {/* Submit Button */}
        <Button title="Submit" onPress={handleSubmit} />
      </ScrollView>

      {/* Fixed Footer Menu */}
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
    position: "relative", // Ensure the container is relative for absolute positioning
  },
  scrollView: {
    flex: 1, // Take up all available space except for the footer
    marginBottom: 60, // Add margin to avoid overlapping with the footer
  },
  scrollContainer: {
    flexGrow: 1, // Ensures the ScrollView expands to fit content
    padding: 20,
    paddingBottom: 80, // Add extra padding to ensure content is scrollable
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
    height: 60, // Set a fixed height for the footer
    backgroundColor: "white", // Ensure the footer has a background color
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
});

export default Appointment;