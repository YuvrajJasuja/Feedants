import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import CategoryChip from '../components/CategoryChip';
import EmptyState from '../components/EmptyState';

type CategoryType = 'All' | 'Updates' | 'Results' | 'Offers';

interface NotificationItem {
  id: string;
  category: CategoryType;
  title: string;
  message: string;
  timestamp: string;
  unread: boolean;
  icon: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    category: 'Updates',
    title: 'Registration Confirmed',
    message: 'You have successfully registered for Classical Kathak Solo Showcase 2026. Spot confirmed.',
    timestamp: '2 hours ago',
    unread: true,
    icon: '🎉',
  },
  {
    id: 'n2',
    category: 'Updates',
    title: 'Submission Reminder',
    message: 'Submission portal closes in 24 hours for Tarana Classical Challenge. Upload your video entry soon!',
    timestamp: '5 hours ago',
    unread: true,
    icon: '⏰',
  },
  {
    id: 'n3',
    category: 'Results',
    title: 'Result Announced',
    message: 'Official judging scores and leaderboard for Classical Singing Solo are now live.',
    timestamp: '1 day ago',
    unread: false,
    icon: '🏆',
  },
  {
    id: 'n4',
    category: 'Updates',
    title: 'New Competition Available',
    message: 'Thumri & Dadra Classical Vocal Championship is now open for registration.',
    timestamp: '2 days ago',
    unread: false,
    icon: '🎭',
  },
  {
    id: 'n5',
    category: 'Offers',
    title: 'Special Early Bird Offer',
    message: 'Get 20% discount on registration fee for Bharatanatyam National Fest 2026.',
    timestamp: '3 days ago',
    unread: false,
    icon: '🎁',
  },
];

export const NotificationsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selectedCat, setSelectedCat] = useState<CategoryType>('All');
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const categories: CategoryType[] = ['All', 'Updates', 'Results', 'Offers'];

  const filtered = notifications.filter(
    (n) => selectedCat === 'All' || n.category === selectedCat
  );

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090D10" />

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>
            {unreadCount > 0 ? `${unreadCount} unread updates` : 'All caught up!'}
          </Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead} style={styles.markReadBtn}>
            <Text style={styles.markReadText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* CATEGORIES */}
      <View style={styles.categoryRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              active={selectedCat === cat}
              onPress={() => setSelectedCat(cat)}
            />
          ))}
        </ScrollView>
      </View>

      {/* NOTIFICATION LIST */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <EmptyState
            icon="🔔"
            title="No notifications"
            message={`No ${selectedCat !== 'All' ? selectedCat.toLowerCase() : ''} notifications found.`}
          />
        ) : (
          filtered.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, item.unread && styles.unreadCard]}
              onPress={() => toggleRead(item.id)}
              activeOpacity={0.8}
            >
              <View style={styles.iconBox}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>

              <View style={styles.cardContent}>
                <View style={styles.topMeta}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  {item.unread && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.cardMessage}>{item.message}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080B0D',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: '#9E988D',
    fontSize: 12,
    marginTop: 2,
  },
  markReadBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(212, 164, 70, 0.15)',
  },
  markReadText: {
    color: '#E6C36E',
    fontSize: 11,
    fontWeight: '700',
  },
  categoryRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#12161A',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  unreadCard: {
    borderColor: 'rgba(217, 164, 65, 0.3)',
    backgroundColor: '#161B20',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C2228',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  cardContent: {
    flex: 1,
  },
  topMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D4A446',
  },
  cardMessage: {
    color: '#9E988D',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
  },
  timestamp: {
    color: '#706C64',
    fontSize: 10,
  },
});

export default NotificationsScreen;
