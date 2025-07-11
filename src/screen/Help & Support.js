import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { LanguageContext } from './LanguageContext';
import FooterMenu from './FooterMenu';

const HelpSupport = () => {
  const { isDarkMode } = useTheme();
  const { language } = useContext(LanguageContext);

  const translations = {
    english: {
      title: "Help & Support",
      contactTitle: "Contact Us",
      email: "Email Support",
      phone: "Phone Support",
      liveChat: "Live Chat",
      faqTitle: "Frequently Asked Questions",
      faq1: "How do I reset my password?",
      faq2: "How do I update my profile information?",
      faq3: "What are Care Coins and how do I earn them?",
      faq4: "How do I report a problem with the app?",
      faq5: "How do I change the app language?",
      resourcesTitle: "Resources",
      userGuide: "User Guide",
      videoTutorials: "Video Tutorials",
      community: "Community Forum",
      feedbackTitle: "Feedback",
      feedbackText: "We'd love to hear your suggestions for improving our app.",
      feedbackButton: "Submit Feedback",
      emergencyTitle: "Emergency Support",
      emergencyText: "For immediate assistance with critical issues:",
      emergencyButton: "Emergency Contact"
    },
    amharic: {
      title: "እርዳታ እና ድጋፍ",
      contactTitle: "አግኙን",
      email: "ኢሜይል ድጋፍ",
      phone: "የስልክ ድጋፍ",
      liveChat: "ቀጥታ ውይይት",
      faqTitle: "በተደጋጋሚ የሚነሱ ጥያቄዎች",
      faq1: "የይለፍ ቃሌን እንዴት እደግማለሁ?",
      faq2: "የመገለጫ መረጃዬን እንዴት እዘምናለሁ?",
      faq3: "ኬር ኮይኖች ምንድን ናቸው እና እንዴት እንደማገኛቸው?",
      faq4: "በአፕሊኬሽኑ ላይ ችግር ካጋጠመኝ እንዴት ሪፖርት ማድረግ እችላለሁ?",
      faq5: "የአፕሊኬሽኑን ቋንቋ እንዴት እቀይራለሁ?",
      resourcesTitle: "መርጃዎች",
      userGuide: "የተጠቃሚ መመሪያ",
      videoTutorials: "ቪዲዮ ትምህርቶች",
      community: "የማህበረሰብ መድረክ",
      feedbackTitle: "ግብረ መልስ",
      feedbackText: "አፕሊኬሽናችንን ለማሻሻል ሀሳቦችዎን �ምን እንድንሰማቸው እንፈልጋለን።",
      feedbackButton: "ግብረ መልስ ላክ",
      emergencyTitle: "አደገኛ ድጋፍ",
      emergencyText: "ለአስቸኳይ ጉዳቶች ወዲያውኑ ድጋፍ:",
      emergencyButton: "ድንገተኛ ግንኙነት"
    }
  };

  const t = translations[language];

  const handleEmailPress = () => {
    Linking.openURL('mailto:care4you1619@gmail.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+251939945270');
  };

  const handleLiveChatPress = () => {
    // Implement live chat functionality or link
    Alert.alert("Live Chat", "Our live chat support will be available soon.");
  };

  const handleEmergencyPress = () => {
    Linking.openURL('tel:+251939945270');
  };

  const handleFeedbackPress = () => {
    // Implement feedback functionality
    Alert.alert("Feedback", "Thank you for wanting to provide feedback. Please email us at feedback@careapp.com");
  };

  const renderSupportOption = (iconName, text, onPress) => (
    <TouchableOpacity 
      style={[styles.supportOption, isDarkMode && styles.darkSupportOption]} 
      onPress={onPress}
    >
      <Ionicons 
        name={iconName} 
        size={24} 
        color={isDarkMode ? '#2196F3' : '#000'} 
        style={styles.optionIcon}
      />
      <Text style={[styles.optionText, isDarkMode && styles.darkText]}>{text}</Text>
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={isDarkMode ? '#fff' : '#666'} 
      />
    </TouchableOpacity>
  );

  const renderFAQItem = (question) => (
    <View style={[styles.faqItem, isDarkMode && styles.darkFaqItem]}>
      <Text style={[styles.faqQuestion, isDarkMode && styles.darkText]}>{question}</Text>
      <Ionicons 
        name="chevron-down" 
        size={20} 
        color={isDarkMode ? '#fff' : '#666'} 
      />
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>{t.title}</Text>
        
        {/* Contact Section */}
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{t.contactTitle}</Text>
        {renderSupportOption("mail-outline", t.email, handleEmailPress)}
        {renderSupportOption("call-outline", t.phone, handlePhonePress)}
        
        {/* FAQ Section */}
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{t.faqTitle}</Text>
        {renderFAQItem(t.faq1)}
        {renderFAQItem(t.faq2)}
        {renderFAQItem(t.faq3)}
        {renderFAQItem(t.faq4)}
        {renderFAQItem(t.faq5)}
        
        {/* Resources Section */}
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{t.resourcesTitle}</Text>
        {renderSupportOption("document-text-outline", t.userGuide, () => {})}
        {renderSupportOption("videocam-outline", t.videoTutorials, () => {})}
        {renderSupportOption("people-outline", t.community, () => {})}
        
       
        {/* Emergency Section */}
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{t.emergencyTitle}</Text>
        <Text style={[styles.sectionText, isDarkMode && styles.darkText]}>{t.emergencyText}</Text>
        <TouchableOpacity 
          style={[styles.emergencyButton, isDarkMode && styles.darkEmergencyButton]}
          onPress={handleEmergencyPress}
        >
          <Ionicons name="warning-outline" size={20} color="#fff" />
          <Text style={styles.emergencyButtonText}>{t.emergencyButton}</Text>
        </TouchableOpacity>
      </ScrollView>
      <FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
    color: '#2196F3',
  },
  sectionText: {
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
    lineHeight: 22,
  },
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 10,
  },
  darkSupportOption: {
    backgroundColor: '#333',
  },
  optionIcon: {
    marginRight: 15,
    width: 30,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  darkFaqItem: {
    borderBottomColor: '#333',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  actionButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  darkActionButton: {
    backgroundColor: '#0d47a1',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emergencyButton: {
    flexDirection: 'row',
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  darkEmergencyButton: {
    backgroundColor: '#b71c1c',
  },
  emergencyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default HelpSupport;