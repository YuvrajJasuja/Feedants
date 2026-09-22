import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface Props {
  title: string;
  points: number;
  description: string;
}

export const RewardCard: React.FC<Props> = ({ title, points, description }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>+{points} PTS</Text>
        </View>
      </View>
      <Text style={styles.desc}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#12161A',
    borderColor: 'rgba(212, 164, 70, 0.25)',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  pointsBadge: {
    backgroundColor: 'rgba(212, 164, 70, 0.15)',
    borderColor: '#D4A446',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pointsText: {
    color: '#E6C36E',
    fontSize: 11,
    fontWeight: '800',
  },
  desc: {
    color: '#9E988D',
    fontSize: 12,
    lineHeight: 16,
  },
});

export default RewardCard;
