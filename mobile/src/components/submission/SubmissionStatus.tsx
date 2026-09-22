import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

interface Props {
  submissionId: string;
  title: string;
  competitionTitle?: string;
  onGoToMyCompetitions: () => void;
  onGoToDetails: () => void;
}

export const SubmissionStatus: React.FC<Props> = ({
  submissionId,
  title,
  competitionTitle,
  onGoToMyCompetitions,
  onGoToDetails,
}) => {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.badgeCircle}>
        <Text style={styles.icon}>⏳</Text>
      </View>
      <Text style={styles.title}>Submission Under Review</Text>
      <Text style={styles.subtitle}>
        Your performance entry has been successfully recorded in MongoDB and submitted to the judging panel.
      </Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Submission ID:</Text>
          <Text style={styles.value}>{submissionId || 'SUB-2026-8841'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Entry Title:</Text>
          <Text style={styles.value}>{title}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Competition:</Text>
          <Text style={styles.value}>{competitionTitle || 'Feedants Classical Contest'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>UNDER REVIEW</Text>
          </View>
        </View>
      </View>

      <PrimaryButton
        title="Go to My Competitions"
        onPress={onGoToMyCompetitions}
        style={{ width: '100%', marginBottom: 12 }}
      />

      <SecondaryButton
        title="Back to Competition Details"
        onPress={onGoToDetails}
        style={{ width: '100%' }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  badgeCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(212, 164, 70, 0.2)',
    borderColor: '#D4A446',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    color: '#9E988D',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.25)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    color: '#9E988D',
    fontSize: 12,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  statusPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10B981',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '800',
  },
});

export default SubmissionStatus;
