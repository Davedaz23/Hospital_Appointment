import { StyleSheet } from 'react-native';
import { useTheme } from './ThemeContext';

export const useThemeStyles = () => {
  const { isDarkMode } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#fff',
      padding: 20,
      position: "relative",
    },
    darkText: {
      color: isDarkMode ? '#fff' : '#000',
    },
    settingText: {
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#000',
    },
    // Add all your theme-dependent styles here
  });

  return styles;
};