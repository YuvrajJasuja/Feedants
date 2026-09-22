import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  label: string;
  active: boolean;
  onPress: () => void;
}

export const CategoryChip: React.FC<Props> = ({ label, active, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.activeChip]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, active && styles.activeText]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    backgroundColor: '#151A1E',
    borderColor: 'rgba(217, 164, 65, 0.15)',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 9999,
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: '#D4A446',
    borderColor: '#D4A446',
  },
  text: {
    color: '#9E988D',
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: '#080B0D',
    fontWeight: '700',
  },
});

export default CategoryChip;
