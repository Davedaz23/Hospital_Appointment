import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker"; // Import expo-image-picker
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "../config/firebaseConfig"; // Import the Firebase app

const db = getFirestore(app); // Initialize Firestore

const HospitalRegistration = () => {
  const [hospitalId, setHospitalId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  // Function to request permission and select an image
  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "You need to grant camera roll permission.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Enable cropping
      aspect: [4, 3], // Aspect ratio
      quality: 1, // Full quality
    });

    // Check if the user cancelled the picker
    if (result.canceled) {
      Alert.alert("Image Selection", "No image was selected.");
      return;
    }

    // Log the result to see what is being returned
    console.log("Image selected:", result);

    // Check if there are assets and set the image URI
    if (result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0]; // Get the first asset
      setPhoto(selectedAsset.uri); // Set the image URI
    } else {
      Alert.alert("Error", "Could not retrieve the image. Please try again.");
    }
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

    setLoading(true); // Set loading state
    try {
      await addDoc(collection(db, "hospitals"), {
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
    } finally {
      setLoading(false); // Reset loading state
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

      <TouchableOpacity style={styles.imageUploadButton} onPress={selectImage}>
        <Text style={styles.imageUploadText}>Select Photo</Text>
      </TouchableOpacity>

      {photo ? (
        <Image source={{ uri: photo }} style={styles.imagePreview} />
      ) : (
        <Text style={styles.placeholderText}>No photo selected</Text>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loadingIndicator} />
      ) : (
        <Button title="Register Hospital" onPress={handleSubmit} />
      )}
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
  imageUploadButton: {
    backgroundColor: "#007BFF", // Button color
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  imageUploadText: {
    color: "#FFFFFF", // Text color
    fontSize: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 5,
  },
  placeholderText: {
    marginVertical: 10,
    color: "#888", // Placeholder color
    textAlign: "center",
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});

export default HospitalRegistration;