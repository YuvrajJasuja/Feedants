import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { competitionApi, CompetitionDetails } from '../services/competitionApi';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [competitions, setCompetitions] = useState<CompetitionDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadFeatured() {
      const res = await competitionApi.getAllCompetitions();
      if (res.success && res.data) {
        setCompetitions(res.data);
      }
      setLoading(false);
    }
    loadFeatured();
  }, []);

  const featured = competitions[0];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Feedants Classical Arts</Text>
        <Text style={styles.subtitle}>Discover talent and active classical competitions.</Text>

        {loading ? (
          <ActivityIndicator size="small" color="#D4A446" />
        ) : featured ? (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('CompetitionDetails', { id: featured.id || featured._id })}
            activeOpacity={0.8}
          >
            <Text style={styles.cardBadge}>FEATURED COMPETITION</Text>
            <Text style={styles.cardTitle}>{featured.title}</Text>
            <Text style={styles.cardSub}>Prize Pool: ₹{featured.prizePool} | Entry: ₹{featured.entryFee}</Text>
            <View style={styles.buttonWrapper}>
              <Text style={styles.buttonText}>View Details & Register →</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <Text style={styles.subtitle}>No active competitions found.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080B0D',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#9E988D',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.22)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'flex-start',
  },
  cardBadge: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardSub: {
    color: '#E6C36E',
    fontSize: 13,
    marginBottom: 16,
  },
  buttonWrapper: {
    backgroundColor: '#D4A446',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#080B0D',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default HomeScreen;
