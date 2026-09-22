import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';

interface Props {
  message?: string;
}

export const LoadingState: React.FC<Props> = ({ message = 'Loading content...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#D4A446" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#9E988D',
    fontSize: 13,
    marginTop: 12,
    fontWeight: '500',
  },
});

export default LoadingState;
