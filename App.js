import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/context/AuthContext';
import { LanguageProvider } from './src/screen/LanguageContext';
import SearchResults from './SearchResults';
import MainContent from './src/screen/main';
import Login from './src/screen/Login';
import Appointment from './src/screen/appointment';
import PatientRegistration from './src/screen/PatientRegistration1';
import Hospitals from './src/screen/Hospitals';
import About from './src/screen/About';
import Contact from './src/screen/Contact';
import Profile from './src/screen/Profile';
import OtpScreen from './src/screen/Otp';
import AppointmentList from './src/screen/AppointmentList';
import HospitalRegistration from './src/screen/HospitalRegistration';

import { ThemeProvider } from './src/theme/ThemeContext';
import CareCoin from './src/screen/careCoin';

import AdminDashboard from './src/screen/AdminDashboard';


const Stack = createStackNavigator();

const App = () => {
  return (

    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider> 
          <NavigationContainer>
            <Stack.Navigator 
              initialRouteName="Login"
              screenOptions={{
                headerShown: false, // This will hide the header for all screens by default
              }}
            >
              <Stack.Screen
                name="Login"
                component={Login}
                options={{
                  headerLeft: null,
                }}
              />
              <Stack.Screen name="MainContent" component={MainContent} />
              <Stack.Screen name="PatientRegistration" component={PatientRegistration} />
              <Stack.Screen 
                name="Appointment" 
                component={Appointment}   
                options={{
                  headerLeft: null,
                }} 
              />
 <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
              <Stack.Screen name="Hospitals" component={Hospitals} />
              <Stack.Screen name="About" component={About} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="Contact" component={Contact} />
              <Stack.Screen name="HospitalRegistration" component={HospitalRegistration} />
              <Stack.Screen name="AppointmentList" component={AppointmentList} />
              <Stack.Screen name="OtpScreen" component={OtpScreen} />
              <Stack.Screen name="CareCoin" component={CareCoin} />
              <Stack.Screen name="SearchResults" component={SearchResults} />
            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>

  );
};

export default App;