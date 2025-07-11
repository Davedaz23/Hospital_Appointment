import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  TouchableWithoutFeedback, 
  Keyboard,
  SafeAreaView,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FooterMenu = ({ isDarkMode }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState(route.name);
  const insets = useSafeAreaInsets();

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    navigation.navigate(tabName);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        {/* Footer Menu */}
        <View style={[
          styles.footerMenu, 
          isDarkMode && styles.darkFooterMenu,
          { 
            paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
            height: 60 + (insets.bottom > 0 ? insets.bottom : 20)
          }
        ]}>
          {/* Home Tab */}
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => handleTabPress('Appointment')}
          >
            <Ionicons 
              name="home" 
              size={24} 
              color={activeTab === 'Appointment' ? '#0066cc' : '#666'} 
            />
            <Text style={[
              styles.navText,
              activeTab === 'Appointment' && styles.activeNavText,
              isDarkMode && styles.darkNavText
            ]}>
              Home
            </Text>
          </TouchableOpacity>
          
          {/* Hospitals Tab */}
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => handleTabPress('Hospitals')}
          >
            <Ionicons 
              name="medkit" 
              size={24} 
              color={activeTab === 'Hospitals' ? '#0066cc' : '#666'} 
            />
            <Text style={[
              styles.navText,
              activeTab === 'Hospitals' && styles.activeNavText,
              isDarkMode && styles.darkNavText
            ]}>
              Hospitals
            </Text>
          </TouchableOpacity>
          
          {/* My Appointments Tab */}
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => handleTabPress('AppointmentList')}
          >
            <Ionicons 
              name="calendar" 
              size={24} 
              color={activeTab === 'AppointmentList' ? '#0066cc' : '#666'} 
            />
            <Text style={[
              styles.navText,
              activeTab === 'AppointmentList' && styles.activeNavText,
              isDarkMode && styles.darkNavText
            ]}>
              My Appointments
            </Text>
          </TouchableOpacity>
          
          {/* Profile Tab */}
          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => handleTabPress('Profile')}
          >
            <Ionicons 
              name="person" 
              size={24} 
              color={activeTab === 'Profile' ? '#0066cc' : '#666'} 
            />
            <Text style={[
              styles.navText,
              activeTab === 'Profile' && styles.activeNavText,
              isDarkMode && styles.darkNavText
            ]}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#1E1E1E',
  },
  footerMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  darkFooterMenu: {
    backgroundColor: '#1E1E1E',
    borderTopColor: '#333',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
  darkNavText: {
    color: '#aaa',
  },
  activeNavText: {
    fontWeight: 'bold',
    color: '#0066cc',
  },
});

export default FooterMenu;