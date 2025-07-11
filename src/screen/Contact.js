import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons

const Contact = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <View style={styles.contactInfo}>
          <Ionicons name="mail" size={20} color="black" />
          <Text style={styles.contactText}>care4you1619@gmail.com</Text>
          <Ionicons name="call" size={20} color="black" style={styles.contactIcon} />
        </View>
        <View style={styles.socialLinks}>
          <TouchableOpacity><Ionicons name="logo-twitter" size={20} color="black" /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="logo-facebook" size={20} color="black" /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="logo-instagram" size={20} color="black" /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="logo-linkedin" size={20} color="black" /></TouchableOpacity>
        </View>
      </View>

      {/* Contact Form */}
      <View style={styles.contactForm}>
        <Text style={styles.heading}>Contact Us</Text>
        <Text style={styles.subHeading}>We'd love to hear from you!</Text>

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#999"
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
          />
        </View>

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Enter your message"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Send Message</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
  contactIcon: {
    marginLeft: 10,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
  },
  contactForm: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    color: '#333',
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Contact;