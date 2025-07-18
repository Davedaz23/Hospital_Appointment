import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { View, Text, FlatList, StyleSheet, Image, Modal, TextInput, Alert } from "react-native";
import { Button } from "react-native-paper"; // Expo paper button
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import db from "../config/firestoreConfig";
import { Picker } from '@react-native-picker/picker'; // Expo picker
import { Ionicons, FontAwesome } from "@expo/vector-icons"; // Expo icons
=======
import { View, Text, FlatList, StyleSheet, Image, Modal, TextInput, Button, Alert } from "react-native";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import db from "../config/firestoreConfig";
import RNPickerSelect from "react-native-picker-select"; // Import the picker package
import { Ionicons, FontAwesome } from "react-native-vector-icons"; // Import icons package
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const updateUserRole = async (userId, newRole) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });
<<<<<<< HEAD
      Alert.alert("Success", "User role updated successfully!");
=======
      alert("User role updated successfully!");
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const deactivateUser = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
<<<<<<< HEAD
      await updateDoc(userRef, { status: "inactive" });
      Alert.alert("Success", "User deactivated successfully!");
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
=======
      await updateDoc(userRef, { status: "inactive" }); // Update status to inactive instead of deleting
      alert("User deactivated successfully!");
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId)); // Remove from local list
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
    } catch (error) {
      console.error("Error deactivating user:", error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUpdatedUser({ name: user.name, email: user.email, role: user.role });
    setShowEditModal(true);
  };

  const saveEditedUser = async () => {
    if (!updatedUser.name || !updatedUser.email || !updatedUser.role) {
<<<<<<< HEAD
      Alert.alert("Error", "Please fill out all fields.");
=======
      alert("Please fill out all fields.");
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
      return;
    }

    try {
      const userRef = doc(db, "users", selectedUser.id);
      await updateDoc(userRef, updatedUser);
<<<<<<< HEAD
      Alert.alert("Success", "User updated successfully!");
=======
      alert("User updated successfully!");
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
      setShowEditModal(false);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === selectedUser.id ? { ...user, ...updatedUser } : user
        )
      );
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

<<<<<<< HEAD
=======
  const addUser = () => {
    // Logic to add user (you can open a modal or navigate to another screen)
    alert("Add user functionality will go here");
  };

>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
  if (loading) return <Text>Loading users...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
<<<<<<< HEAD
            {/* Profile Image */}
            <View style={styles.tableCell}>
              <Image
                source={{ uri: item.profilePicture || 'https://via.placeholder.com/150' }}
                style={styles.profileImage}
              />
            </View>
            
            {/* Name and Role */}
=======
            {/* Profile Image (First Column) */}
            <View style={styles.tableCell}>
              <Image
                source={{ uri: item.profilePicture || 'default_image_url_here' }} // Add a default URL if the image is not available
                style={styles.profileImage}
              />
            </View>
            {/* Name and Role (Second Column) */}
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
            <View style={styles.tableCell}>
              <Text style={styles.userInfo}>{item.name}</Text>
              <Text style={styles.userInfo}>Role: {item.role}</Text>
            </View>
<<<<<<< HEAD
            
            {/* Role Picker */}
            <View style={styles.tableCell}>
              <Picker
                selectedValue={item.role}
                style={styles.picker}
                onValueChange={(value) => updateUserRole(item.id, value)}
              >
                <Picker.Item label="Admin" value="admin" />
                <Picker.Item label="Customer" value="customer" />
                <Picker.Item label="Manager" value="manager" />
              </Picker>
            </View>
            
            {/* Action Icons */}
            <View style={styles.tableCell}>
              <Ionicons
                name="eye"
=======
            {/* Dropdown for Role Update (Third Column) */}
            <View style={styles.tableCell}>
              <RNPickerSelect
                onValueChange={(value) => {
                  if (value !== item.role) {
                    updateUserRole(item.id, value);
                  }
                }}
                items={[
                  { label: "Admin", value: "admin" },
                  { label: "Customer", value: "customer" },
                  { label: "Manager", value: "manager" },
                ]}
                value={item.role}
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                Icon={() => <Ionicons name="chevron-down" size={18} color="gray" />} // Chevron icon
              />
            </View>
            {/* CRUD Icons for Edit, View, Deactivate */}
            <View style={styles.tableCell}>
              <Ionicons
                name="eye"  // View icon
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
                size={24}
                color="blue"
                style={styles.icon}
                onPress={() => handleViewUser(item)}
              />
              <Ionicons
<<<<<<< HEAD
                name="create"
=======
                name="create"  // Edit icon
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
                size={24}
                color="orange"
                style={styles.icon}
                onPress={() => handleEditUser(item)}
              />
              <FontAwesome
<<<<<<< HEAD
                name="trash"
=======
                name="trash"  // Deactivate icon (previously delete)
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
                size={24}
                color="red"
                style={styles.icon}
                onPress={() =>
<<<<<<< HEAD
                  Alert.alert(
                    "Deactivate User", 
                    "Are you sure you want to deactivate this user?", 
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Yes", onPress: () => deactivateUser(item.id) },
                    ]
                  )
=======
                  Alert.alert("Deactivate User", "Are you sure you want to deactivate this user?", [
                    { text: "Cancel", style: "cancel" },
                    { text: "Yes", onPress: () => deactivateUser(item.id) },
                  ])
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
                }
              />
            </View>
          </View>
        )}
      />

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        onRequestClose={() => setShowEditModal(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit User</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={updatedUser.name}
              onChangeText={(text) => setUpdatedUser({ ...updatedUser, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={updatedUser.email}
              onChangeText={(text) => setUpdatedUser({ ...updatedUser, email: text })}
            />
<<<<<<< HEAD
            <Picker
              selectedValue={updatedUser.role}
              style={styles.picker}
              onValueChange={(value) => setUpdatedUser({ ...updatedUser, role: value })}
            >
              <Picker.Item label="Admin" value="admin" />
              <Picker.Item label="Customer" value="customer" />
              <Picker.Item label="Manager" value="manager" />
            </Picker>
            <View style={styles.buttonContainer}>
              <Button 
                mode="contained" 
                onPress={saveEditedUser}
                style={styles.button}
              >
                Save
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => setShowEditModal(false)}
                style={styles.button}
              >
                Cancel
              </Button>
            </View>
=======
            <RNPickerSelect
              onValueChange={(value) => setUpdatedUser({ ...updatedUser, role: value })}
              items={[
                { label: "Admin", value: "admin" },
                { label: "Customer", value: "customer" },
                { label: "Manager", value: "manager" },
              ]}
              value={updatedUser.role}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              Icon={() => <Ionicons name="chevron-down" size={18} color="gray" />}
            />
            <Button title="Save" onPress={saveEditedUser} />
            <Button title="Cancel" onPress={() => setShowEditModal(false)} />
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
          </View>
        </View>
      </Modal>

      {/* View Modal */}
      <Modal
        visible={showViewModal}
        onRequestClose={() => setShowViewModal(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>User Details</Text>
<<<<<<< HEAD
            <Image
              source={{ uri: selectedUser?.profilePicture || 'https://via.placeholder.com/150' }}
              style={styles.modalProfileImage}
            />
            <Text>Name: {selectedUser?.name}</Text>
            <Text>Email: {selectedUser?.email}</Text>
            <Text>Role: {selectedUser?.role}</Text>
            <Button 
              mode="contained"
              onPress={() => setShowViewModal(false)}
              style={styles.button}
            >
              Close
            </Button>
=======
            <Text>Name: {selectedUser?.name}</Text>
            <Text>Email: {selectedUser?.email}</Text>
            <Text>Role: {selectedUser?.role}</Text>
            <Button title="Close" onPress={() => setShowViewModal(false)} />
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  tableCell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
<<<<<<< HEAD
    borderRadius: 25,
  },
  modalProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
=======
    borderRadius: 25, // Makes the image circular
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
  },
  userInfo: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
<<<<<<< HEAD
  picker: {
    width: 120,
    height: 50,
=======
  dropdown: {
    height: 40,
    width: 150,
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
  },
  icon: {
    marginHorizontal: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
<<<<<<< HEAD
    width: '80%',
=======
    width: 300,
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
<<<<<<< HEAD
    width: '100%',
=======
    width: 200,
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
<<<<<<< HEAD
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  button: {
    marginHorizontal: 5,
    flex: 1,
  }
});

export default AdminDashboard;
=======
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 30,
    width: 120,
    backgroundColor: 'lightgray',
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 14,
  },
  inputAndroid: {
    height: 30,
    width: 120,
    backgroundColor: 'lightgray',
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 14,
  },
});

export default AdminDashboard;
>>>>>>> 1ceabdea72b611baeb802a9fe57d3645a70c23db
