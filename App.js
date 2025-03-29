import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/context/AuthContext'; // Import AuthProvider
import SearchResults from './SearchResults'; // Example screen for search results
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

const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider> 
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ title: 'Care4You',
              headerLeft: null, // Disable the back button

             }}
          />
          <Stack.Screen name="MainContent" component={MainContent} options={{ title: 'Main Content' }} />
          <Stack.Screen name="PatientRegistration" component={PatientRegistration} />
          <Stack.Screen name="Appointment" component={Appointment}   options={{
              headerLeft: null, // Disable the back button

             }} />
          <Stack.Screen name="Hospitals" component={Hospitals} />
          <Stack.Screen name="About" component={About} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Contact" component={Contact} />
          <Stack.Screen name="HospitalRegistration" component={HospitalRegistration} />
          <Stack.Screen name="AppointmentList" component={AppointmentList} />
          <Stack.Screen name="OtpScreen" component={OtpScreen} />
          <Stack.Screen
            name="SearchResults"
            component={SearchResults}
            options={{ title: 'Search Results' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
