import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { competitionApi, CompetitionDetails } from '../services/competitionApi';
import SectionHeader from '../components/SectionHeader';
import CategoryChip from '../components/CategoryChip';
import CompetitionCard from '../components/CompetitionCard';
import FeaturedCompetitionCard from '../components/FeaturedCompetitionCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

const CATEGORIES = ['All', 'Dance', 'Singing', 'Art', 'Photography', 'Fashion'];

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [competitions, setCompetitions] = useState<CompetitionDetails[]>([]);
  const [filteredComps, setFilteredComps] = useState<CompetitionDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getInitials = (name?: string) => {
    if (!name) return 'YJ';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = user ? user.name.split(' ')[0] : 'Yuvraj';

  const loadData = async () => {
    setLoading(true);
    setError(null);
    const res = await competitionApi.getAllCompetitions();
    if (res.success && res.data) {
      setCompetitions(res.data);
      setFilteredComps(res.data);
    } else {
      setError(typeof res.error === 'string' ? res.error : 'Failed to fetch competitions.');
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  useEffect(() => {
    let result = competitions;
    if (selectedCategory !== 'All') {
      result = result.filter(
        (c) => c.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q)
      );
    }
    setFilteredComps(result);
  }, [selectedCategory, searchQuery, competitions]);

  const featured = competitions[0];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090D10" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4A446" />}
      >
        {/* HEADER USER GREETING */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greetingTitle}>Hi, {displayName} 👋</Text>
            <Text style={styles.greetingSub}>Let's explore your next opportunity.</Text>
          </View>
          <View style={styles.headerRightActions}>
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.8}
              accessibilityLabel="Notifications menu"
            >
              <Text style={{ fontSize: 16 }}>🔔</Text>
              <View style={styles.headerNotificationDot} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileBadge}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.8}
              accessibilityLabel="Profile menu"
            >
              <Text style={styles.profileBadgeText}>{getInitials(user?.name)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchBarContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search classical dance, singing, art..."
            placeholderTextColor="#706C64"
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Search competitions"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={{ color: '#9E988D', fontSize: 14 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* CATEGORY CHIPS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              active={selectedCategory === cat}
              onPress={() => setSelectedCategory(cat)}
            />
          ))}
        </ScrollView>

        {/* CONTENT */}
        {loading ? (
          <LoadingState message="Loading live competitions..." />
        ) : error ? (
          <ErrorState message={error} onRetry={loadData} />
        ) : (
          <>
            {/* FEATURED COMPETITION (REAL API DATA) */}
            {featured && (
              <>
                <SectionHeader title="Featured Competition" />
                <FeaturedCompetitionCard
                  competition={featured}
                  onPress={() => navigation.navigate('CompetitionDetails', { id: featured.id || featured._id })}
                />
              </>
            )}

            {/* TRENDING COMPETITIONS LIST */}
            <SectionHeader
              title="Trending Competitions"
              actionText="See All"
              onActionPress={() => navigation.navigate('Explore')}
            />

            {filteredComps.length === 0 ? (
              <EmptyState
                icon="🔍"
                title="No competitions found"
                message={`No active competitions match "${searchQuery || selectedCategory}".`}
                buttonText="Reset Filters"
                onButtonPress={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
              />
            ) : (
              filteredComps.map((comp) => (
                <CompetitionCard
                  key={comp.id || comp._id}
                  competition={comp}
                  onPress={() => navigation.navigate('CompetitionDetails', { id: comp.id || comp._id })}
                />
              ))
            )}
          </>
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
  scrollContent: {
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  greetingTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  greetingSub: {
    color: '#9E988D',
    fontSize: 12,
    marginTop: 2,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.2)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerNotificationDot: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D4A446',
  },
  profileBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 164, 70, 0.2)',
    borderColor: '#D4A446',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBadgeText: {
    color: '#F5DE98',
    fontSize: 14,
    fontWeight: '700',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 14,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 13,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});

export default HomeScreen;
