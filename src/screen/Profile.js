import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FooterMenu from './FooterMenu';
import LogoutButton from './LogoutButton';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import app from '../config/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Initialize Firestore and Storage
const db = getFirestore(app);

const Profile = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  useEffect(() => {
    const loadPhoneNumber = async () => {
      try {
        const storedPhone = await AsyncStorage.getItem('userPhone');
        if (storedPhone) {
          setPhone(storedPhone);
          const userRef = doc(db, 'users', storedPhone);
          const userSnapshot = await getDoc(userRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setName(userData.name || '');
            setEmail(userData.email || '');
            setProfilePicture(userData.profilePicture || '');
          } else {
            Alert.alert("Error", "No such document!");
          }
        }
      } catch (error) {
        Alert.alert("Error", "Error loading phone number: " + error.message);
      }
    };
    loadPhoneNumber();
  }, []);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const toggleNotifications = () => setNotificationsEnabled(prev => !prev);

  const saveProfile = async () => {
    if (!name || !email || !phone) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const userRef = doc(db, 'users', phone);
    try {
      await updateDoc(userRef, { name, email, profilePicture, phone });
      Alert.alert("Success", "Profile updated successfully!");
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Error updating profile: " + error.message);
    }
  };

  const pickImage = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      setProfilePicture(selectedImage);
      
      // Update the profile picture in Firestore
      const userRef = doc(db, 'users', phone);
      try {
        await updateDoc(userRef, { profilePicture: selectedImage }); // Use the selected image URI
  
        Alert.alert("Success", "Profile picture uploaded successfully!");
      
      } catch (error) {
        Alert.alert("Error", "Error updating profile picture: " + error.message);
      }
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
   

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity style={styles.profilePicContainer} onPress={pickImage}>
          <Image source={{ uri: profilePicture || 'https://via.placeholder.com/150' }} style={styles.profilePic} />
          <Ionicons name="camera" size={20} color="#fff" style={styles.cameraIcon} />
        </TouchableOpacity>
        <Text style={[styles.profileName, isDarkMode && styles.darkText]}>{name || 'John Doe'}</Text>
        <Text style={[styles.profileEmail, isDarkMode && styles.darkText]}>{email || 'johndoe@example.com'}</Text>

        {/* Edit Profile Button */}
        <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="create-outline" size={16} color="#fff" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Settings */}
      <View style={styles.settingsContainer}>
        <View style={styles.settingItem}>
          <Text style={[styles.settingText, isDarkMode && styles.darkText]}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} trackColor={{ false: '#767577', true: '#81b0ff' }} thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'} />
        </View>
        <View style={styles.settingItem}>
          <Text style={[styles.settingText, isDarkMode && styles.darkText]}>Enable Notifications</Text>
          <Switch value={notificationsEnabled} onValueChange={toggleNotifications} trackColor={{ false: '#767577', true: '#81b0ff' }} thumbColor={notificationsEnabled ? '#f5dd4b' : '#f4f3f4'} />
        </View>

        {/* Other Options */}
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('HelpSupport')}>
          <View style={styles.iconTextContainer}>
            <Ionicons name="help-circle-outline" size={20} color={isDarkMode ? '#fff' : '#000'} />
            <Text style={[styles.settingText, isDarkMode && styles.darkText]}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('PrivacyPolicy')}>
          <View style={styles.iconTextContainer}>
            <Ionicons name="shield-checkmark-outline" size={20} color={isDarkMode ? '#fff' : '#000'} />
            <Text style={[styles.settingText, isDarkMode && styles.darkText]}>Privacy Policy</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('TermsConditions')}>
          <View style={styles.iconTextContainer}>
            <Ionicons name="document-text-outline" size={20} color={isDarkMode ? '#fff' : '#000'} />
            <Text style={[styles.settingText, isDarkMode && styles.darkText]}>Terms & Conditions</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>

        <LogoutButton isDarkMode={isDarkMode} styles={styles} />
      </View>

      <FooterMenu />

      {/* Edit Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalView, isDarkMode && styles.darkModal]}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>Edit Profile</Text>

            <TextInput
              placeholder="Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              style={[styles.input, isDarkMode && styles.darkInput]}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              style={[styles.input, isDarkMode && styles.darkInput]}
            />
            <TextInput
              placeholder="Phone"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={setPhone}
              style={[styles.input, isDarkMode && styles.darkInput]}
            />

            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#fff' }}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={saveProfile}>
                <Text style={{ color: '#fff' }}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  darkText: {
    color: '#fff',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePicContainer: {
    position: 'relative',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#2196F3',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 2,
  },
  profileName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    marginLeft: 5,
  },
  settingsContainer: {
    marginTop: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#fff',
    padding: 35,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
  },
  darkModal: {
    backgroundColor: '#333',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    fontSize: 16,
  },
  darkInput: {
    backgroundColor: '#444',
    color: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
});

export default Profile;