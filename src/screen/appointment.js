import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { Picker } from '@react-native-picker/picker';
import FooterMenu from "./FooterMenu";
import db from '../config/firestoreConfig';
import { collection, getDocs, query, where, setDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

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
  const [isLanguageDropdownVisible, setIsLanguageDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Translation object
  const translations = {
    english: {
      welcome: "Welcome",
      userProfileTitle: "User Profile",
      name: "Name",
      email: "Email",
      phone: "Phone",
      appointmentForm: "Get an Appointment",
      fullName: "Full Name *",
      enterFullName: "Enter full name",
      enterEmail: "Enter email",
      enterPhoneNumber: "Enter phone number",
      selectHospital: "Select Hospital *",
      searchHospital: "Search Hospital",
      appointmentDate: "Appointment Date *",
      selectDate: "Select Date",
      selectedDate: "Selected Date",
      address: "Address",
      enterAddress: "Enter address",
      description: "Description",
      enterDescription: "Enter description",
      submit: "Submit",
      selectLanguage: "English",
      english: "English",
      amharic: "አማርኛ",
    },
    amharic: {
      welcome: "እንኳን ደህና መጣህ",
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
      searchHospital: "ሆስፒታል ፈልግ",
      appointmentDate: "የቀጠሮ ቀን *",
      selectDate: "ቀን ይምረጡ",
      selectedDate: "የተመረጠ ቀን",
      address: "አድራሻ",
      enterAddress: "አድራሻ ያስገቡ",
      description: "መግለጫ",
      enterDescription: "መግለጫ ያስገቡ",
      submit: "አስገባ",
      selectLanguage: "አማርኛ",
      english: "English",
      amharic: "አማርኛ",
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
      const cleanedPhone = phone.replace(/\D/g, '').trim();
      const formattedPhone = `+${cleanedPhone}`;

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

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownVisible(!isLanguageDropdownVisible);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setIsLanguageDropdownVisible(false);
  };

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const t = translations[language];

  return (
    <View style={styles.container}>
      {/* Combined Header and Profile Section */}
      <View style={styles.headerProfileSection}>
        <View style={styles.profileRow}>
          <View style={styles.profileColumn}>
          <View style={styles.profileRow}>
            <Image 
              source={{ uri: userProfile?.profilePicture || 'https://via.placeholder.com/150' }} 
              style={styles.profilePic} 
            />
            <View style={styles.profileDetails}>
            <Text style={styles.welcomeText}>{t.welcome}</Text>
            <Text style={styles.userName}>{userProfile?.name || "N/A"}</Text>
          </View>
          </View>
            <View style={styles.searchContainer}>
              <Ionicons 
                name="search" 
                size={20} 
                color="#888" 
                style={styles.searchIcon} 
              />
              <TextInput
                style={styles.searchInput}
                placeholder={t.searchHospital}
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
          
         
        </View>
        
        <View style={styles.headerControls}>
          <TouchableOpacity style={styles.notificationIcon}>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.languageDropdownContainer}>
            <TouchableOpacity 
              onPress={toggleLanguageDropdown} 
              style={styles.languageButton}
            >
              <Text style={styles.languageButtonText}>{t.selectLanguage}</Text>
              <Ionicons name="chevron-down" size={12} color="white" />
            </TouchableOpacity>

            {isLanguageDropdownVisible && (
              <View style={styles.languageDropdownMenu}>
                <TouchableOpacity 
                  onPress={() => changeLanguage('english')} 
                  style={styles.languageOption}
                >
                  <Text style={styles.languageOptionText}>{t.english}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => changeLanguage('amharic')} 
                  style={styles.languageOption}
                >
                  <Text style={styles.languageOptionText}>{t.amharic}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
      >
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
            {filteredHospitals.map((hospital) => (
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  headerProfileSection: {
    width: '100%',
    padding: 15,
    backgroundColor: "#2196F3",
    paddingTop: 40,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  profileColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: 20,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'white',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingVertical: 0,
  },
  profileDetails: {
    flex: 1,
    justifyContent: 'center',
    marginLeft:10,
  },
  welcomeText: {
    color: "white",
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  userName: {
    color: "white",
    fontSize: 18,
    fontWeight: '600',
  },
  headerControls: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    marginRight: 15,
  },
  languageDropdownContainer: {
    zIndex: 1,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
  },
  languageButtonText: {
    marginRight: 4,
    fontSize: 12,
    color: 'white',
  },
  languageDropdownMenu: {
    position: 'absolute',
    top: 32,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    minWidth: 100,
  },
  languageOption: {
    paddingVertical: 4,
  },
  languageOptionText: {
    fontSize: 12,
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