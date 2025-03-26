import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from "react-native";

import { launchImageLibrary } from "react-native-image-picker";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import app from '../config/firebaseConfig';  // Import the Firebase app

const db = getFirestore(app); // Initialize Firestore

const HospitalRegistration = () => {
  const [hospitalId, setHospitalId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);

  // Function to select an image from the library
  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.error("ImagePicker Error: ", response.errorCode);
      } else if (response.assets && response.assets.length > 0) {
        setPhoto(response.assets[0].uri); // Get the image URI
      } else {
        console.error("Unexpected response from image picker");
      }
    });
  };

  // Function to validate form fields
  const validateForm = () => {
    if (!hospitalId || !name || !description || !photo) {
      Alert.alert("Error", "Please fill all fields and select a photo.");
      return false;
    }
    return true;
  };

  // Function to handle the submission of the form
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Add hospital data to Firestore
      await addDoc(collection(db, 'hospitals'), {
        hospitalId,
        name,
        description,
        photo,
      });
      Alert.alert("Success", "Hospital registered successfully.");
      // Clear the form
      setHospitalId("");
      setName("");
      setDescription("");
      setPhoto(null);
    } catch (error) {
      console.error("Error registering hospital:", error);
      Alert.alert("Error", "Failed to register hospital. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hospital Registration</Text>

      <Text style={styles.label}>Hospital ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Hospital ID"
        value={hospitalId}
        onChangeText={setHospitalId}
      />

      <Text style={styles.label}>Hospital Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Hospital Name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Enter Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Button title="Select Photo" onPress={selectImage} />
      {photo && <Image source={{ uri: photo }} style={styles.imagePreview} />}

      <Button title="Register Hospital" onPress={handleSubmit} />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
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
  imagePreview: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 5,
  },
});

export default HospitalRegistration;