import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [activeModalTitle, setActiveModalTitle] = useState<string>('');
  const [activeModalDesc, setActiveModalDesc] = useState<string>('');

  const openPlaceholder = (title: string, desc: string) => {
    setActiveModalTitle(title);
    setActiveModalDesc(desc);
    setModalVisible(true);
  };

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.navigate('Auth');
        },
      },
    ]);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'FJ';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const MENU_ITEMS = [
    {
      id: 'edit_profile',
      icon: '✏️',
      title: 'Edit Profile',
      subtitle: 'Personal info, bio, avatar',
      onPress: () => openPlaceholder('Edit Profile', 'Update your personal details, bio, and classical art credentials.'),
    },
    {
      id: 'my_competitions',
      icon: '🎗️',
      title: 'My Competitions',
      subtitle: 'Registered contests & active status',
      onPress: () => navigation.navigate('MainTabs', { screen: 'MyCompetitions' }),
    },
    {
      id: 'my_submissions',
      icon: '🎬',
      title: 'My Submissions',
      subtitle: 'Uploaded performances & review status',
      onPress: () => navigation.navigate('UploadSubmission'),
    },
    {
      id: 'payment_history',
      icon: '💳',
      title: 'Payment History',
      subtitle: 'Transactions, entry fees & receipts',
      onPress: () => openPlaceholder('Payment History', 'View transaction invoices and payment receipts for contest registrations.'),
    },
    {
      id: 'saved_competitions',
      icon: '🔖',
      title: 'Saved Competitions',
      subtitle: 'Bookmarked challenges & events',
      onPress: () => openPlaceholder('Saved Competitions', 'Access your bookmarked classical dance and singing contests.'),
    },
    {
      id: 'refer_earn',
      icon: '🎁',
      title: 'Refer & Earn',
      subtitle: 'Invite fellow artists & earn points',
      onPress: () => openPlaceholder('Refer & Earn', 'Share your unique referral code with fellow performers to gain bonus points.'),
    },
    {
      id: 'help_support',
      icon: '❓',
      title: 'Help & Support',
      subtitle: 'FAQs, guidelines & support team',
      onPress: () => openPlaceholder('Help & Support', 'Get assistance with registration, video uploads, or contest rules.'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090D10" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* PROFILE HEADER CARD */}
        {isAuthenticated && user ? (
          <View style={styles.profileHeaderCard}>
            <View style={styles.avatarWrapper}>
              {user.profileImage ? (
                <Image source={{ uri: user.profileImage }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarInitials}>{getInitials(user.name)}</Text>
              )}
              <View style={styles.verifiedBadge}>
                <Text style={{ fontSize: 9, color: '#FFFFFF' }}>✓</Text>
              </View>
            </View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userRole}>Feedants Performer & Artist</Text>
          </View>
        ) : (
          <View style={styles.unauthCard}>
            <Text style={styles.unauthTitle}>Guest Artist</Text>
            <Text style={styles.unauthSub}>Sign in to track your competition registrations & submissions.</Text>
            <PrimaryButton
              title="Sign In / Register"
              onPress={() => navigation.navigate('Auth')}
              style={{ marginTop: 12, width: '100%' }}
            />
          </View>
        )}

        {/* STATS ROW */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{isAuthenticated ? '3' : '0'}</Text>
            <Text style={styles.statLabel}>Participations</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: '#F59E0B' }]}>{isAuthenticated ? '1' : '0'}</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: '#E6C36E' }]}>{isAuthenticated ? '450' : '0'}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>

        {/* MENU LIST */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuSectionHeader}>Account & Preferences</Text>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconBox}>
                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
              </View>
              <View style={styles.menuTextGroup}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSub}>{item.subtitle}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}

          {/* LOGOUT / LOGIN BUTTON */}
          {isAuthenticated ? (
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
              <Text style={styles.logoutIcon}>🚪</Text>
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          ) : (
            <SecondaryButton
              title="Sign In to Account"
              icon="🔐"
              onPress={() => navigation.navigate('Auth')}
              style={{ marginTop: 12 }}
            />
          )}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* POLISHED "COMING SOON" PLACEHOLDER MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalBadge}>
              <Text style={{ fontSize: 28 }}>🚧</Text>
            </View>
            <Text style={styles.modalTitle}>{activeModalTitle}</Text>
            <Text style={styles.modalTag}>COMING SOON</Text>
            <Text style={styles.modalDesc}>{activeModalDesc}</Text>
            <Text style={styles.modalNote}>
              This section is reserved for future releases. The Competition Details feature remains fully functional.
            </Text>
            <PrimaryButton
              title="Close & Return"
              onPress={() => setModalVisible(false)}
              style={{ width: '100%', marginTop: 16 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080B0D',
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  profileHeaderCard: {
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.3)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  unauthCard: {
    backgroundColor: '#12161A',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  unauthTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  unauthSub: {
    color: '#9E988D',
    fontSize: 12,
    textAlign: 'center',
  },
  avatarWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(212, 164, 70, 0.2)',
    borderColor: '#D4A446',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
  },
  avatarInitials: {
    color: '#F5DE98',
    fontSize: 24,
    fontWeight: '800',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10B981',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  userEmail: {
    color: '#9E988D',
    fontSize: 12,
    marginTop: 2,
  },
  userRole: {
    color: '#E6C36E',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#12161A',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    color: '#9E988D',
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuContainer: {
    backgroundColor: '#12161A',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
  },
  menuSectionHeader: {
    color: '#706C64',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1A2026',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTextGroup: {
    flex: 1,
  },
  menuTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  menuSub: {
    color: '#9E988D',
    fontSize: 11,
    marginTop: 2,
  },
  chevron: {
    color: '#706C64',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    borderWidth: 1,
  },
  logoutIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.3)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  modalBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(212, 164, 70, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalTag: {
    color: '#D4A446',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
  },
  modalDesc: {
    color: '#D1D5DB',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 10,
  },
  modalNote: {
    color: '#706C64',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 15,
  },
});

export default ProfileScreen;
