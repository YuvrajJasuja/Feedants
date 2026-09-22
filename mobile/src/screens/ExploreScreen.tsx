import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { competitionApi, CompetitionDetails } from '../services/competitionApi';

export const ExploreScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [competitions, setCompetitions] = useState<CompetitionDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadAll() {
      const res = await competitionApi.getAllCompetitions();
      if (res.success && res.data) {
        setCompetitions(res.data);
      }
      setLoading(false);
    }
    loadAll();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Explore Competitions</Text>
        <Text style={styles.subtitle}>Browse active classical dance, music, and art challenges.</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#D4A446" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={competitions}
            keyExtractor={(item) => item.id || item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('CompetitionDetails', { id: item.id || item._id })}
                activeOpacity={0.8}
              >
                <Text style={styles.cardBadge}>{item.currentState || 'LIVE COMPETITION'}</Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSub}>
                  Prize Pool: ₹{item.prizePool?.toLocaleString('en-IN')} | Entry: ₹{item.entryFee}
                </Text>
              </TouchableOpacity>
            )}
          />
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
    padding: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 10,
  },
  subtitle: {
    color: '#9E988D',
    fontSize: 13,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.22)',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  cardBadge: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSub: {
    color: '#E6C36E',
    fontSize: 12,
  },
});

export default ExploreScreen;
