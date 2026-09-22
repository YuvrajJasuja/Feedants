import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface Props {
  status: string;
}

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const isFullOrClosed = status === 'REGISTRATION_CLOSED' || status === 'REGISTRATION_FULL' || status === 'COMPLETED';
  const label = status ? status.replace(/_/g, ' ') : 'OPEN';

  return (
    <View style={[styles.badge, isFullOrClosed ? styles.closedBg : styles.openBg]}>
      <View style={[styles.dot, isFullOrClosed ? styles.closedDot : styles.openDot]} />
      <Text style={[styles.text, isFullOrClosed ? styles.closedText : styles.openText]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    borderWidth: 1,
    gap: 4,
  },
  openBg: {
    backgroundColor: '#052A20',
    borderColor: '#137854',
  },
  closedBg: {
    backgroundColor: 'rgba(147, 0, 10, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  openDot: {
    backgroundColor: '#10B981',
  },
  closedDot: {
    backgroundColor: '#EF4444',
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  openText: {
    color: '#10B981',
  },
  closedText: {
    color: '#EF4444',
  },
});

export default StatusBadge;
