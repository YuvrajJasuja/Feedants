import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

export const AuthScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('yuvraj@feedants.com');
  const [password, setPassword] = useState<string>('••••••••');
  const [fullName, setFullName] = useState<string>('Yuvraj Jasuja');

  const handleSubmit = () => {
    Alert.alert(
      isLogin ? 'Welcome Back!' : 'Account Created!',
      `Logged in as ${email}. Navigating to Feedants Home.`,
      [{ text: 'Continue', onPress: () => navigation.navigate('MainTabs', { screen: 'Home' }) }]
    );
  };

  const handleSocialPlaceholder = (provider: string) => {
    Alert.alert(
      'Future Integration',
      `${provider} authentication is planned for a future production release. Please sign in with Email & Password.`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090D10" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* LOGO BRANDING */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>👑</Text>
          </View>
          <Text style={styles.brandTitle}>FEEDANTS</Text>
          <Text style={styles.brandSub}>Classical Talent & Competition Platform</Text>
        </View>

        {/* TOGGLE TABS */}
        <View style={styles.toggleBar}>
          <TouchableOpacity
            style={[styles.toggleBtn, isLogin && styles.toggleBtnActive]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, !isLogin && styles.toggleBtnActive]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* FORM INPUTS */}
        <View style={styles.formContainer}>
          {!isLogin && (
            <>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Yuvraj Jasuja"
                placeholderTextColor="#706C64"
              />
            </>
          )}

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="artist@feedants.com"
            placeholderTextColor="#706C64"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Enter password"
            placeholderTextColor="#706C64"
          />

          {isLogin && (
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          <PrimaryButton
            title={isLogin ? 'Sign In' : 'Create Account'}
            onPress={handleSubmit}
            style={{ marginTop: 16 }}
          />
        </View>

        {/* DIVIDER */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* SOCIAL AUTH PLACEHOLDERS */}
        <View style={styles.socialButtonsContainer}>
          <SecondaryButton
            title="Google (Future Integration)"
            icon="🌐"
            onPress={() => handleSocialPlaceholder('Google')}
            style={{ marginBottom: 10 }}
          />

          <SecondaryButton
            title="Apple (Future Integration)"
            icon="🍎"
            onPress={() => handleSocialPlaceholder('Apple')}
          />
        </View>

        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
        >
          <Text style={styles.skipText}>Skip & Explore as Guest →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080B0D',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(212, 164, 70, 0.2)',
    borderColor: '#D4A446',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoIcon: {
    fontSize: 28,
  },
  brandTitle: {
    color: '#D4A446',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2,
  },
  brandSub: {
    color: '#9E988D',
    fontSize: 12,
    marginTop: 4,
  },
  toggleBar: {
    flexDirection: 'row',
    backgroundColor: '#12161A',
    borderRadius: 12,
    padding: 3,
    marginBottom: 20,
    borderColor: 'rgba(217, 164, 65, 0.2)',
    borderWidth: 1,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 9,
  },
  toggleBtnActive: {
    backgroundColor: '#D4A446',
  },
  toggleText: {
    color: '#9E988D',
    fontSize: 13,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#080B0D',
    fontWeight: '700',
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 13,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 4,
  },
  forgotText: {
    color: '#E6C36E',
    fontSize: 12,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  dividerText: {
    color: '#706C64',
    fontSize: 10,
    fontWeight: '700',
    marginHorizontal: 10,
  },
  socialButtonsContainer: {
    marginBottom: 20,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  skipText: {
    color: '#9E988D',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default AuthScreen;
