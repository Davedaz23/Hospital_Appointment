import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, Modal, TextInput, Button, Alert } from "react-native";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import db from "../config/firestoreConfig";
import RNPickerSelect from "react-native-picker-select"; // Import the picker package
import { Ionicons, FontAwesome } from "react-native-vector-icons"; // Import icons package

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
      alert("User role updated successfully!");
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
      await updateDoc(userRef, { status: "inactive" }); // Update status to inactive instead of deleting
      alert("User deactivated successfully!");
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId)); // Remove from local list
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
      alert("Please fill out all fields.");
      return;
    }

    try {
      const userRef = doc(db, "users", selectedUser.id);
      await updateDoc(userRef, updatedUser);
      alert("User updated successfully!");
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

  const addUser = () => {
    // Logic to add user (you can open a modal or navigate to another screen)
    alert("Add user functionality will go here");
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
            {/* Profile Image (First Column) */}
            <View style={styles.tableCell}>
              <Image
                source={{ uri: item.profilePicture || 'default_image_url_here' }} // Add a default URL if the image is not available
                style={styles.profileImage}
              />
            </View>
            {/* Name and Role (Second Column) */}
            <View style={styles.tableCell}>
              <Text style={styles.userInfo}>{item.name}</Text>
              <Text style={styles.userInfo}>Role: {item.role}</Text>
            </View>
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
                size={24}
                color="blue"
                style={styles.icon}
                onPress={() => handleViewUser(item)}
              />
              <Ionicons
                name="create"  // Edit icon
                size={24}
                color="orange"
                style={styles.icon}
                onPress={() => handleEditUser(item)}
              />
              <FontAwesome
                name="trash"  // Deactivate icon (previously delete)
                size={24}
                color="red"
                style={styles.icon}
                onPress={() =>
                  Alert.alert("Deactivate User", "Are you sure you want to deactivate this user?", [
                    { text: "Cancel", style: "cancel" },
                    { text: "Yes", onPress: () => deactivateUser(item.id) },
                  ])
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
            <Text>Name: {selectedUser?.name}</Text>
            <Text>Email: {selectedUser?.email}</Text>
            <Text>Role: {selectedUser?.role}</Text>
            <Button title="Close" onPress={() => setShowViewModal(false)} />
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
    borderRadius: 25, // Makes the image circular
  },
  userInfo: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  dropdown: {
    height: 40,
    width: 150,
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
    width: 300,
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
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
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
