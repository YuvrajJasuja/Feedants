import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { userApi, UserCompetitionItem } from '../services/userApi';
import CompetitionCard from '../components/CompetitionCard';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

type TabType = 'Upcoming' | 'Ongoing' | 'Completed';

export const MyCompetitionsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('Ongoing');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<UserCompetitionItem[]>([]);

  const loadData = async () => {
    if (!isAuthenticated) {
      setItems([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await userApi.getMyCompetitions();
      if (res.success && res.data) {
        setItems(res.data);
      } else {
        setError(typeof res.error === 'string' ? res.error : 'Failed to fetch user competitions.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error loading my competitions.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Filter items according to tab state
  const getFilteredItems = () => {
    return items.filter((item) => {
      const state = item.competition.currentState || item.competition.status;
      if (activeTab === 'Upcoming') {
        return state === 'UPCOMING' || state === 'REGISTRATION_OPEN';
      }
      if (activeTab === 'Ongoing') {
        return state === 'REGISTRATION_CLOSED' || state === 'SUBMISSION_OPEN' || state === 'SUBMISSION_CLOSED' || state === 'JUDGING';
      }
      if (activeTab === 'Completed') {
        return state === 'RESULTS_PUBLISHED' || state === 'COMPLETED';
      }
      return true;
    });
  };

  const filtered = getFilteredItems();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090D10" />

      {/* SCREEN HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>My Competitions</Text>
        <Text style={styles.subtitle}>Track your registered contests, submission progress & awards</Text>

        {/* TABS */}
        <View style={styles.tabBar}>
          {(['Upcoming', 'Ongoing', 'Completed'] as TabType[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabItem, isActive && styles.activeTabItem]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* CONTENT AREA */}
      {loading ? (
        <LoadingState message="Fetching your contest registrations..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4A446" />}
        >
          {filtered.length === 0 ? (
            <View style={styles.emptyContainer}>
              <EmptyState
                icon="🎗️"
                title="No competitions yet"
                message="Discover a competition and showcase your talent."
                buttonText="Explore Competitions"
                onButtonPress={() => navigation.navigate('Explore')}
              />
            </View>
          ) : (
            filtered.map(({ competition, participation }) => {
              const compId = competition.id || competition._id;
              return (
                <View key={compId} style={styles.cardContainer}>
                  {/* Status Banner */}
                  <View style={styles.participationHeader}>
                    <Text style={styles.partStatusLabel}>
                      Status: {participation?.status?.replace(/_/g, ' ') || 'REGISTERED'}
                    </Text>
                    <Text style={styles.submissionState}>
                      Submission: {participation?.hasSubmitted ? 'Submitted ✅' : 'Pending ⏳'}
                    </Text>
                  </View>

                  <CompetitionCard
                    competition={competition}
                    onPress={() => navigation.navigate('CompetitionDetails', { id: compId })}
                  />
                </View>
              );
            })
          )}
          <View style={{ height: 80 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080B0D',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    color: '#9E988D',
    fontSize: 12,
    marginBottom: 14,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#12161A',
    borderRadius: 12,
    padding: 3,
    borderColor: 'rgba(217, 164, 65, 0.15)',
    borderWidth: 1,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 9,
  },
  activeTabItem: {
    backgroundColor: '#D4A446',
  },
  tabText: {
    color: '#9E988D',
    fontSize: 12,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#080B0D',
    fontWeight: '700',
  },
  scrollContent: {
    paddingTop: 16,
  },
  emptyContainer: {
    marginTop: 40,
  },
  cardContainer: {
    marginBottom: 12,
  },
  participationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  partStatusLabel: {
    color: '#E6C36E',
    fontSize: 11,
    fontWeight: '700',
  },
  submissionState: {
    color: '#D1D5DB',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default MyCompetitionsScreen;
