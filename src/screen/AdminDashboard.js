import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, Modal, TextInput, Alert } from "react-native";
import { Button } from "react-native-paper"; // Expo paper button
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import db from "../config/firestoreConfig";
import { Picker } from '@react-native-picker/picker'; // Expo picker
import { Ionicons, FontAwesome } from "@expo/vector-icons"; // Expo icons

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
      Alert.alert("Success", "User role updated successfully!");
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
      await updateDoc(userRef, { status: "inactive" });
      Alert.alert("Success", "User deactivated successfully!");
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
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
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    try {
      const userRef = doc(db, "users", selectedUser.id);
      await updateDoc(userRef, updatedUser);
      Alert.alert("Success", "User updated successfully!");
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

  if (loading) return <Text>Loading users...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            {/* Profile Image */}
            <View style={styles.tableCell}>
              <Image
                source={{ uri: item.profilePicture || 'https://via.placeholder.com/150' }}
                style={styles.profileImage}
              />
            </View>
            
            {/* Name and Role */}
            <View style={styles.tableCell}>
              <Text style={styles.userInfo}>{item.name}</Text>
              <Text style={styles.userInfo}>Role: {item.role}</Text>
            </View>
            
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
                size={24}
                color="blue"
                style={styles.icon}
                onPress={() => handleViewUser(item)}
              />
              <Ionicons
                name="create"
                size={24}
                color="orange"
                style={styles.icon}
                onPress={() => handleEditUser(item)}
              />
              <FontAwesome
                name="trash"
                size={24}
                color="red"
                style={styles.icon}
                onPress={() =>
                  Alert.alert(
                    "Deactivate User", 
                    "Are you sure you want to deactivate this user?", 
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Yes", onPress: () => deactivateUser(item.id) },
                    ]
                  )
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
    borderRadius: 25,
  },
  modalProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  userInfo: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  picker: {
    width: 120,
    height: 50,
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
    width: '80%',
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
    width: '100%',
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
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