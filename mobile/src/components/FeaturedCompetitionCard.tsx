import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CompetitionDetails } from '../services/competitionApi';
import StatusBadge from './StatusBadge';

interface Props {
  competition: CompetitionDetails;
  onPress: () => void;
}

export const FeaturedCompetitionCard: React.FC<Props> = ({ competition, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.topRow}>
        <View style={styles.featuredTag}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.featuredText}>FEATURED</Text>
        </View>
        <StatusBadge status={competition.currentState || competition.status} />
      </View>

      <Text style={styles.title}>{competition.title}</Text>
      <Text style={styles.subtitle} numberOfLines={2}>
        {competition.description}
      </Text>

      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>PRIZE POOL</Text>
          <Text style={styles.metricValue}>₹ {competition.prizePool?.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>ENTRY FEE</Text>
          <Text style={styles.metricValue}>₹ {competition.entryFee}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>SPOTS LEFT</Text>
          <Text style={styles.spotsValue}>{competition.remainingSpots}</Text>
        </View>
      </View>

      <View style={styles.buttonWrapper}>
        <LinearGradient
          colors={['#F0D58C', '#E4BC66', '#B9892F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBtn}
        >
          <Text style={styles.btnText}>View Competition & Register →</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.3)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  featuredTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212, 164, 70, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  star: {
    color: '#FBBF24',
    fontSize: 10,
  },
  featuredText: {
    color: '#E6C36E',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: '#9E988D',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    backgroundColor: '#090D10',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 16,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
  },
  metricItem: {
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  metricLabel: {
    color: '#9E988D',
    fontSize: 8,
    fontWeight: '600',
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  spotsValue: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  buttonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#080B0D',
    fontSize: 13,
    fontWeight: '800',
  },
});

export default FeaturedCompetitionCard;
