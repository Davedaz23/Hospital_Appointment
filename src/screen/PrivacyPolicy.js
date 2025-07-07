import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { LanguageContext } from './LanguageContext';
import FooterMenu from './FooterMenu';

const PrivacyPolicy = () => {
  const { isDarkMode } = useTheme();
  const { language } = useContext(LanguageContext);

  const translations = {
    english: {
      title: "Privacy Policy",
      lastUpdated: "Last Updated: June 1, 2023",
      intro: "Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our app.",
      infoWeCollect: "Information We Collect",
      infoWeCollectContent: "We may collect personal information such as your name, email address, phone number, and profile picture when you register for an account. We also collect usage data and device information.",
      howWeUse: "How We Use Your Information",
      howWeUseContent: "We use the information we collect to:\n- Provide and maintain our service\n- Notify you about changes to our service\n- Allow you to participate in interactive features\n- Provide customer support\n- Gather analysis to improve our service",
      dataSecurity: "Data Security",
      dataSecurityContent: "We implement appropriate technical and organizational measures to protect your personal data. However, no method of transmission over the Internet is 100% secure.",
      changes: "Changes to This Policy",
      changesContent: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.",
      contact: "Contact Us",
      contactContent: "If you have any questions about this Privacy Policy, please contact us at privacy@careapp.com."
    },
    amharic: {
      title: "የግላዊነት ፖሊሲ",
      lastUpdated: "የመጨረሻ ዝመና: ሰኔ 1, 2015",
      intro: "የእርስዎ ግላዊነት ለእኛ አስፈላጊ ነው። ይህ የግላዊነት ፖሊሲ አፕሊኬሽናችንን በሚጠቀሙበት ጊዜ መረጃዎን እንዴት እንሰበስብ፣ እንጠቀም፣ እንገልጽ እና እንደምንጠብቅ ያብራራል።",
      infoWeCollect: "የምንሰበስበው መረጃ",
      infoWeCollectContent: "አካውንት ሲፈጥሩ �ስም፣ የኢሜይል አድራሻ፣ የስልክ ቁጥር እና የመገለጫ ፎቶ ያሉ የግል መረጃዎችን ልንሰበስብ እንችላለን። የአጠቃቀም መረጃ እና የመሳሪያ መረጃንም እንሰበስባለን።",
      howWeUse: "መረጃዎን እንዴት እንጠቀማለን",
      howWeUseContent: "የምንሰበስበውን መረጃ እንጠቀማለን፡\n- አገልግሎታችንን ለመስጠት እና ለመጠበቅ\n- ስለ አገልግሎታችን ለውጦች ለማሳወቅ\n- በተዋዋይ ባህሪያት ውስጥ እንዲሳተፉ ለማድረግ\n- የደንበኛ �ለጋ ለመስጠት\n- አገልግሎታችንን ለማሻሻል ትንታኔ ለማድረግ",
      dataSecurity: "የውሂብ ደህንነት",
      dataSecurityContent: "የግል ውሂብዎን ለመጠበቅ ተገቢ የሆኑ ቴክኒካዊ እና ድርጅታዊ እርምጃዎችን እንይዛለን። ሆኖም በኢንተርኔት ላይ የሚላክ ምንም ዘዴ 100% ደህንነቱ የተጠበቀ አይደለም።",
      changes: "በዚህ ፖሊሲ ላይ የተደረጉ ለውጦች",
      changesContent: "የግላዊነት ፖሊሲችንን ከጊዜ �ደ ጊዜ ልንዘምን እንችላለን። ማንኛውም ለውጥ በዚህ ገጽ ላይ አዲሱን የግላዊነት ፖሊሲ በማስቀመጥ እናሳውቅዎታለን።",
      contact: "አግኙን",
      contactContent: "ስለዚህ የግላዊነት ፖሊሲ ጥያቄ ካለዎት እባክዎን በ privacy@careapp.com ያግኙን።"
    }
  };

  const t = translations[language];

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>{t.title}</Text>
        <Text style={[styles.lastUpdated, isDarkMode && styles.darkText]}>{t.lastUpdated}</Text>
        
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{t.intro}</Text>
        
        <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>{t.infoWeCollect}</Text>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>{t.infoWeCollectContent}</Text>
        
        <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>{t.howWeUse}</Text>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>{t.howWeUseContent}</Text>
        
        <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>{t.dataSecurity}</Text>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>{t.dataSecurityContent}</Text>
        
        <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>{t.changes}</Text>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>{t.changesContent}</Text>
        
        <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>{t.contact}</Text>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>{t.contactContent}</Text>
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
    marginBottom: 5,
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  lastUpdated: {
    fontSize: 12,
    marginBottom: 20,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#2196F3',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    color: '#333',
  },
});

export default PrivacyPolicy;