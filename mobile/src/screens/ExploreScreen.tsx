import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { competitionApi, CompetitionDetails } from '../services/competitionApi';
import CategoryChip from '../components/CategoryChip';
import CompetitionCard from '../components/CompetitionCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

const CATEGORIES = ['All', 'Dance', 'Singing', 'Art', 'Photography', 'Fashion'];

export const ExploreScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [competitions, setCompetitions] = useState<CompetitionDetails[]>([]);
  const [filteredComps, setFilteredComps] = useState<CompetitionDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<{ [id: string]: boolean }>({});

  const loadAllCompetitions = async () => {
    setLoading(true);
    setError(null);
    const res = await competitionApi.getAllCompetitions();
    if (res.success && res.data) {
      setCompetitions(res.data);
      setFilteredComps(res.data);
    } else {
      setError(typeof res.error === 'string' ? res.error : 'Unable to load competitions.');
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadAllCompetitions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadAllCompetitions();
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

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090D10" />

      {/* HEADER TITLE */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore Competitions</Text>
        <Text style={styles.subtitle}>Discover live classical, art, and music talent challenges</Text>

        {/* SEARCH INPUT */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title, category, or keyword..."
            placeholderTextColor="#706C64"
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Search competitions input"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={{ color: '#9E988D', fontSize: 14 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* CATEGORY FILTERS */}
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
      </View>

      {/* CONTENT LIST */}
      {loading ? (
        <LoadingState message="Fetching all active competitions..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadAllCompetitions} />
      ) : filteredComps.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No competitions match filters"
          message={`No active contests found for "${searchQuery || selectedCategory}". Try adjusting your filters.`}
          buttonText="Reset All Filters"
          onButtonPress={() => {
            setSelectedCategory('All');
            setSearchQuery('');
          }}
        />
      ) : (
        <FlatList
          data={filteredComps}
          keyExtractor={(item) => item.id || item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4A446" />}
          renderItem={({ item }) => {
            const compId = item.id || item._id;
            const isFav = !!favorites[compId];
            return (
              <View style={styles.cardWrapper}>
                <CompetitionCard
                  competition={item}
                  onPress={() => navigation.navigate('CompetitionDetails', { id: compId })}
                />
                <TouchableOpacity
                  style={styles.favBtn}
                  onPress={() => toggleFavorite(compId)}
                  activeOpacity={0.7}
                  accessibilityLabel="Favorite competition toggle"
                >
                  <Text style={{ fontSize: 16 }}>{isFav ? '❤️' : '🤍'}</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
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
    paddingBottom: 6,
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
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
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
    paddingVertical: 4,
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 80,
  },
  cardWrapper: {
    position: 'relative',
  },
  favBtn: {
    position: 'absolute',
    top: 14,
    right: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});

export default ExploreScreen;
