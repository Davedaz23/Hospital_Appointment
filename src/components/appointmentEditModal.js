import React, { useState } from "react";
import { Modal, View, Text, TextInput, Button, StyleSheet, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const AppointmentEditModal = ({ visible, appointment, onClose, onSave }) => {
  const [fullName, setFullName] = useState(appointment.fullName);
  const [appDate, setAppDate] = useState(new Date(appointment.app_date));
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || appDate;
    setShowPicker(false);
    setAppDate(currentDate);
  };

  const handleSave = () => {
    onSave({ ...appointment, fullName, app_date: appDate.toISOString().split('T')[0] });
    onClose(); // Close the modal after saving
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Edit Appointment</Text>
          <TextInput
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
          />
          <Button title="Select Date" onPress={() => setShowPicker(true)} />
          {showPicker && (
            <DateTimePicker
              value={appDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <TextInput
            placeholder="Selected Date"
            value={appDate.toISOString().split('T')[0]} // Display the date in YYYY-MM-DD format
            editable={false} // Make this field read-only
            style={styles.input}
          />
          <Button title="Save" onPress={handleSave} />
          <Button title="Cancel" onPress={onClose} color="red" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});

export default AppointmentEditModal;  