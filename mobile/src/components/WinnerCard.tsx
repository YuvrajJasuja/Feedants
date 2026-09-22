import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface Props {
  rank: number;
  name: string;
  category: string;
  prize: string;
}

export const WinnerCard: React.FC<Props> = ({ rank, name, category, prize }) => {
  const getBadgeColor = (r: number) => {
    if (r === 1) return '#F59E0B'; // Gold
    if (r === 2) return '#9CA3AF'; // Silver
    if (r === 3) return '#D97706'; // Bronze
    return '#6B7280';
  };

  const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '🏆';

  return (
    <View style={styles.card}>
      <Text style={styles.medal}>{medal}</Text>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.category}>{category}</Text>
      </View>
      <View style={styles.prizeGroup}>
        <Text style={styles.prizeLabel}>Prize</Text>
        <Text style={[styles.prizeValue, { color: getBadgeColor(rank) }]}>{prize}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.2)',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  medal: {
    fontSize: 24,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  category: {
    color: '#9E988D',
    fontSize: 11,
    marginTop: 2,
  },
  prizeGroup: {
    alignItems: 'flex-end',
  },
  prizeLabel: {
    color: '#9E988D',
    fontSize: 9,
  },
  prizeValue: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
});

export default WinnerCard;
