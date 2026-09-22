import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { CompetitionDetails } from '../services/competitionApi';
import StatusBadge from './StatusBadge';

interface Props {
  competition: CompetitionDetails;
  onPress: () => void;
}

export const CompetitionCard: React.FC<Props> = ({ competition, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.topRow}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{competition.category}</Text>
        </View>
        <StatusBadge status={competition.currentState || competition.status} />
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {competition.title}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {competition.description}
      </Text>

      <View style={styles.footerRow}>
        <View style={styles.infoGroup}>
          <Text style={styles.infoLabel}>Prize Pool</Text>
          <Text style={styles.infoValue}>₹ {competition.prizePool?.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.infoGroup}>
          <Text style={styles.infoLabel}>Entry Fee</Text>
          <Text style={styles.infoValue}>₹ {competition.entryFee}</Text>
        </View>
        <View style={styles.infoGroupRight}>
          <Text style={styles.spotsText}>
            {competition.remainingSpots > 0 ? `${competition.remainingSpots} spots left` : 'Full'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.22)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryPill: {
    backgroundColor: '#1C2228',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  categoryText: {
    color: '#E1E2E5',
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    color: '#9E988D',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 10,
  },
  infoGroup: {
    flex: 1,
  },
  infoGroupRight: {
    alignItems: 'flex-end',
  },
  infoLabel: {
    color: '#9E988D',
    fontSize: 9,
  },
  infoValue: {
    color: '#E6C36E',
    fontSize: 13,
    fontWeight: '700',
  },
  spotsText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
});

export default CompetitionCard;
