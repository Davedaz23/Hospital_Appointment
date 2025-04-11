import { AppRegistry } from 'react-native';
import App from '../App'; // Adjust this if your App component is in a different path
import { name as appName } from '../app.json';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('app-root'), // Ensure this matches your HTML
});