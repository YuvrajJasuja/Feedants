import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { CompetitionDetails } from '../../services/competitionApi';

interface Props {
  competition?: CompetitionDetails;
  title: string;
  description: string;
  onChangeTitle: (text: string) => void;
  onChangeDescription: (text: string) => void;
}

export const SubmissionForm: React.FC<Props> = ({
  competition,
  title,
  description,
  onChangeTitle,
  onChangeDescription,
}) => {
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
      {/* COMPETITION INFO SUMMARY CARD */}
      {competition && (
        <View style={styles.compCard}>
          <Text style={styles.compLabel}>SELECTED COMPETITION</Text>
          <Text style={styles.compTitle}>{competition.title}</Text>
          <View style={styles.metaRow}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{competition.category}</Text>
            </View>
            <Text style={styles.deadlineText}>Deadline: {formatDate(competition.submissionEnd)}</Text>
          </View>
        </View>
      )}

      {/* INPUT FORM FIELDS */}
      <Text style={styles.label}>Submission Title *</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={onChangeTitle}
        placeholder="e.g. Classical Kathak Solo - Tarana Teen Taal"
        placeholderTextColor="#706C64"
        maxLength={100}
      />
      <Text style={styles.charCount}>{title.length} / 100 characters</Text>

      <Text style={styles.label}>Performance Description / Raga & Taala Details</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={onChangeDescription}
        placeholder="Describe your choreographic structure, costume, raga, or artistic flow..."
        placeholderTextColor="#706C64"
        multiline
        numberOfLines={4}
        maxLength={500}
      />
      <Text style={styles.charCount}>{description.length} / 500 characters</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  compCard: {
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.25)',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  compLabel: {
    color: '#706C64',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  compTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryPill: {
    backgroundColor: 'rgba(212, 164, 70, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  categoryText: {
    color: '#E6C36E',
    fontSize: 11,
    fontWeight: '700',
  },
  deadlineText: {
    color: '#9E988D',
    fontSize: 11,
  },
  label: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 13,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  charCount: {
    color: '#706C64',
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
});

export default SubmissionForm;
