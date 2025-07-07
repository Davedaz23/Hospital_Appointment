import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { LanguageContext } from './LanguageContext';
import FooterMenu from './FooterMenu';

const TermsConditions = () => {
  const { isDarkMode } = useTheme();
  const { language } = useContext(LanguageContext);

  const translations = {
    english: {
      title: "Terms & Conditions",
      lastUpdated: "Last Updated: June 1, 2025",
      intro: "By downloading or using the app, these terms will automatically apply to you. Please read them carefully before using the app.",
      agreement: "Agreement to Terms",
      agreementContent: "By using our app, you agree to these terms. If you do not agree, do not use the app.",
      appUse: "App Use",
      appUseContent: "You may use the app only for lawful purposes and in accordance with these Terms. You agree not to use the app:\n- In any way that violates any law\n- To harm or attempt to harm others\n- To transmit any viruses or malicious code",
      accounts: "Accounts",
      accountsContent: "When you create an account, you must provide accurate information. You are responsible for maintaining the confidentiality of your account.",
      content: "Content",
      contentContent: "The app allows you to post, link, store and share content. You are responsible for the content you share.",
      changes: "Changes to Terms",
      changesContent: "We may modify these terms at any time. We will notify you of any changes by updating the 'Last Updated' date.",
      termination: "Termination",
      terminationContent: "We may terminate your access to the app without notice if you violate these terms.",
      disclaimer: "Disclaimer",
      disclaimerContent: "The app is provided 'as is' without warranties of any kind. We are not responsible for any damages resulting from app use.",
      contact: "Contact Us",
      contactContent: "For questions about these Terms, contact us at care4you1619@gmail.com."
    },
    amharic: {
      title: "ውሎች እና �ቀታዎች",
      lastUpdated: "የመጨረሻ ዝመና: ሰኔ 1, 2017",
      intro: "አፕሊኬሽኑን በሚያወርዱበት ወይም በሚጠቀሙበት ጊዜ እነዚህ ውሎች በራስ-ሰር ተፈጻሚ ይሆናሉ። አፕሊኬሽኑን ከመጠቀምዎ በፊት እባክዎን በጥንቃቄ ያንብቡ።",
      agreement: "ውሎችን መቀበል",
      agreementContent: "አፕሊኬሽናችንን በመጠቀም እነዚህን ውሎች እንደምትቀበሉ ይቆጠራል። ካልተስማማችሁ አፕሊኬሽኑን አትጠቀሙ።",
      appUse: "የአፕ አጠቃቀም",
      appUseContent: "አፕሊኬሽኑን ለሕጋዊ ዓላማዎች ብቻ እና በእነዚህ ውሎች መሰረት መጠቀም �ይችላሉ። አፕሊኬሽኑን፡\n- ሕግ በሚጣስ መንገድ አትጠቀሙ\n- �ደኛላቸው ሌሎችን ለመጉዳት ወይም ለመጉዳት ለማድረግ አትጠቀሙ\n- ማንኛውንም ቫይረስ ወይም አላማ ያለው ኮድ ለማስተላለፍ አትጠቀሙ",
      accounts: "መለያዎች",
      accountsContent: "መለያ ሲፈጥሩ ትክክለኛ መረጃ ማቅረብ አለብዎት። የመለያዎን �ምስጢር ለመጠበቅ ተገቢውን ኃላፊነት ለዎታለችሁ።",
      content: "ይዘት",
      contentContent: "አፕሊኬሽኑ ይዘት ለማስቀመጥ፣ �ማገናኘት፣ ለማከማቸት እና ለማካፈል ያስችልዎታል። �ሚካፈሉት ይዘት ላይ ኃላፊነት �ዎታለችሁ።",
      changes: "በውሎች ላይ የተደረጉ ለውጦች",
      changesContent: "እነዚህን ውሎች በማንኛውም ጊዜ ልንሻሻል እንችላለን። ማንኛውንም ለውጥ በ'የመጨረሻ ዝመና' ቀን በማዘመን እናሳውቅዎታለን።",
      termination: "ማቋረጥ",
      terminationContent: "እነዚህን ውሎች ካፈረሱ ማስታወቂያ ሳያደርጉ ወደ አፕሊኬሽኑ የሚያደርጉትን መዳረሻ ልናቋርጥ እንችላለን።",
      disclaimer: "ማስጠንቀቂያ",
      disclaimerContent: "አፕሊኬሽኑ 'እንዳለ' የማንኛውም አይነት ዋስትና ሳይሰጥ ይሰጣል። የአፕ አጠቃቀም ምክንያት ለሚከሰቱ ጉዳቶች ኃላፊነት አይወስድም።",
      contact: "አግኙን",
      contactContent: "ስለእነዚህ ውሎች ጥያቄ ካለዎት በ care4you1619@gmail.com ያግኙን።"
    }
  };

  const t = translations[language];

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>{t.title}</Text>
        <Text style={[styles.lastUpdated, isDarkMode && styles.darkText]}>{t.lastUpdated}</Text>
        
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{t.intro}</Text>
        
        <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>{t.agreement}</Text>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>{t.agreementContent}</Text>
        
        <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>{t.appUse}</Text>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>{t.appUseContent}</Text>
        
        <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>{t.accounts}</Text>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>{t.accountsContent}</Text>
        
        <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>{t.content}</Text>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>{t.contentContent}</Text>
        
        <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>{t.changes}</Text>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>{t.changesContent}</Text>
        
        <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>{t.termination}</Text>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>{t.terminationContent}</Text>
        
        <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>{t.disclaimer}</Text>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>{t.disclaimerContent}</Text>
        
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

export default TermsConditions;