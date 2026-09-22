import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { CompetitionDetails } from '../../services/competitionApi';
import PrimaryButton from '../PrimaryButton';

interface Props {
  competition?: CompetitionDetails;
  title: string;
  description: string;
  mediaUri: string;
  mediaFileName?: string;
  submitting: boolean;
  onSubmit: () => void;
}

export const SubmissionReview: React.FC<Props> = ({
  competition,
  title,
  description,
  mediaUri,
  mediaFileName,
  submitting,
  onSubmit,
}) => {
  const [rulesConfirmed, setRulesConfirmed] = useState<boolean>(false);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'TBA';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>Review & Confirm Submission</Text>
      <Text style={styles.stepSub}>Verify all details before submitting to the judging panel.</Text>

      <View style={styles.reviewCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderTitle}>Performance Entry Summary</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Competition:</Text>
          <Text style={styles.reviewVal}>{competition?.title || 'Selected Contest'}</Text>
        </View>

        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Submission Title:</Text>
          <Text style={styles.reviewVal}>{title}</Text>
        </View>

        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Description:</Text>
          <Text style={styles.reviewVal}>{description || 'No description provided'}</Text>
        </View>

        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Media File:</Text>
          <Text style={styles.reviewVal} numberOfLines={1}>
            {mediaFileName || mediaUri}
          </Text>
        </View>

        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Submission Deadline:</Text>
          <Text style={[styles.reviewVal, { color: '#E6C36E' }]}>
            {formatDate(competition?.submissionEnd)}
          </Text>
        </View>
      </View>

      {/* RULES CONFIRMATION CHECKBOX */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setRulesConfirmed(!rulesConfirmed)}
        activeOpacity={0.8}
      >
        <View style={[styles.checkbox, rulesConfirmed && styles.checkboxActive]}>
          {rulesConfirmed && <Text style={styles.checkMark}>✓</Text>}
        </View>
        <Text style={styles.checkboxLabel}>
          I confirm that this submission follows the competition rules and represents my original performance.
        </Text>
      </TouchableOpacity>

      {/* SUBMIT BUTTON */}
      <PrimaryButton
        title={submitting ? 'Submitting...' : 'Submit Entry Now'}
        onPress={onSubmit}
        disabled={!rulesConfirmed || submitting}
        loading={submitting}
        style={{ marginTop: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  stepTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  stepSub: {
    color: '#9E988D',
    fontSize: 13,
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.25)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 12,
  },
  reviewRow: {
    marginBottom: 10,
  },
  reviewLabel: {
    color: '#9E988D',
    fontSize: 11,
    marginBottom: 2,
  },
  reviewVal: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#12161A',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#706C64',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: '#D4A446',
    borderColor: '#D4A446',
  },
  checkMark: {
    color: '#080B0D',
    fontSize: 12,
    fontWeight: '900',
  },
  checkboxLabel: {
    flex: 1,
    color: '#D1D5DB',
    fontSize: 12,
    lineHeight: 17,
  },
});

export default SubmissionReview;
