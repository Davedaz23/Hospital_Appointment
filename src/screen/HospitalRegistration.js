import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "../config/firebaseConfig";
import { LanguageContext } from './LanguageContext';

const db = getFirestore(app); // Initialize Firestore

const HospitalRegistration = () => {
  const { language } = useContext(LanguageContext);
  const [hospitalId, setHospitalId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  // Translation object
  const translations = {
    english: {
      title: "Hospital Registration",
      idLabel: "Hospital ID",
      nameLabel: "Hospital Name",
      descLabel: "Description",
      idPlaceholder: "Enter Hospital ID",
      namePlaceholder: "Enter Hospital Name",
      descPlaceholder: "Enter Description",
      selectPhoto: "Select Photo",
      noPhoto: "No photo selected",
      register: "Register Hospital",
      permissionDenied: "Permission Denied",
      permissionMessage: "You need to grant camera roll permission.",
      noImage: "No image was selected.",
      imageError: "Could not retrieve the image. Please try again.",
      formError: "Please fill all fields and select a photo.",
      success: "Success",
      successMessage: "Hospital registered successfully.",
      error: "Error",
      errorMessage: "Failed to register hospital. Please try again."
    },
    amharic: {
      title: "ሆስፒታል ምዝገባ",
      idLabel: "የሆስፒታል መለያ",
      nameLabel: "የሆስፒታል ስም",
      descLabel: "መግለጫ",
      idPlaceholder: "የሆስፒታል ስም ያስገቡ",
      namePlaceholder: "የሆስፒታል ስም ያስገቡ",
      descPlaceholder: "መግለጫ ያስገቡ",
      selectPhoto: "ፎቶ ይምረጡ",
      noPhoto: "ምንም ፎቶ አልተመረጠም",
      register: "ሆስፒታል ይመዝገቡ",
      permissionDenied: "ፈቃድ ተቀባይነት አላገኘም",
      permissionMessage: "የካሜራ ሮል ፈቃድ መስጠት አለብዎት።",
      noImage: "ምንም ምስል አልተመረጠም።",
      imageError: "ምስሉን ማግኘት አልተቻለም። እባክዎ ደግመው ይሞክሩ።",
      formError: "እባክዎ ሁሉንም መስኮች ይሙሉ እና ፎቶ ይምረጡ።",
      success: "ተሳክቷል",
      successMessage: "ሆስፒታሉ በተሳካ ሁኔታ ተመዝግቧል።",
      error: "ስህተት",
      errorMessage: "ሆስፒታሉን ማመዝገብ አልተቻለም። እባክዎ ደግመው ይሞክሩ።"
    }
  };

  const t = translations[language];

  // Function to request permission and select an image
  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t.permissionDenied, t.permissionMessage);
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
      Alert.alert(t.noImage);
      return;
    }

    // Check if there are assets and set the image URI
    if (result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0]; // Get the first asset
      setPhoto(selectedAsset.uri); // Set the image URI
    } else {
      Alert.alert(t.imageError);
    }
  };

  // Function to validate form fields
  const validateForm = () => {
    if (!hospitalId || !name || !description || !photo) {
      Alert.alert(t.error, t.formError);
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
      Alert.alert(t.success, t.successMessage);
      // Clear the form
      setHospitalId("");
      setName("");
      setDescription("");
      setPhoto(null);
    } catch (error) {
      console.error("Error registering hospital:", error);
      Alert.alert(t.error, t.errorMessage);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.title}</Text>

      <Text style={styles.label}>{t.idLabel}</Text>
      <TextInput
        style={styles.input}
        placeholder={t.idPlaceholder}
        value={hospitalId}
        onChangeText={setHospitalId}
      />

      <Text style={styles.label}>{t.nameLabel}</Text>
      <TextInput
        style={styles.input}
        placeholder={t.namePlaceholder}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>{t.descLabel}</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder={t.descPlaceholder}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.imageUploadButton} onPress={selectImage}>
        <Text style={styles.imageUploadText}>{t.selectPhoto}</Text>
      </TouchableOpacity>

      {photo ? (
        <Image source={{ uri: photo }} style={styles.imagePreview} />
      ) : (
        <Text style={styles.placeholderText}>{t.noPhoto}</Text>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loadingIndicator} />
      ) : (
        <Button title={t.register} onPress={handleSubmit} />
      )}
    </View>
  );
};

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