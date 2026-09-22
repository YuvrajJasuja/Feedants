import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';

export const MyCompetitionsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>My Competitions</Text>
        <Text style={styles.subtitle}>Track your registered contests and active submissions.</Text>
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
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#9E988D',
    fontSize: 13,
    textAlign: 'center',
  },
});

export default MyCompetitionsScreen;
