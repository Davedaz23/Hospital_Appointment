import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import db from "../config/firestoreConfig";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const usersList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(usersList);
  };

  const updateRole = async (userId, newRole) => {
    await updateDoc(doc(db, "users", userId), { role: newRole });
    fetchUsers();
  };

  const deleteUser = async (userId) => {
    await deleteDoc(doc(db, "users", userId));
    fetchUsers();
  };

  const renderItem = ({ item }) => (
    <View style={styles.userCard}>
      <Image source={{ uri: item.profilePicture }} style={styles.profileImage} />
      <View style={styles.userInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text>Status: {item.status}</Text>
        <Text>Role: {item.role}</Text>
      </View>
      <View>
        <TouchableOpacity onPress={() => updateRole(item.id, item.role === "customer" ? "admin" : "customer")}>
          <Text style={styles.button}>Change Role</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteUser(item.id)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Management</Text>
      <FlatList data={users} keyExtractor={(item) => item.id} renderItem={renderItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  userCard: { flexDirection: "row", alignItems: "center", padding: 10, marginBottom: 10, backgroundColor: "#f9f9f9", borderRadius: 8 },
  profileImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  userInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold" },
  email: { fontSize: 14, color: "#666" },
  button: { color: "blue", marginTop: 5 },
  deleteButton: { color: "red", marginTop: 5 },
});

export default UserManagement;
