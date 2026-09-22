import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';

export const UploadSubmissionScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Submission</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Performance Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Classical Kathak Tarana - Teen Taal"
          placeholderTextColor="#706C64"
        />

        <Text style={styles.label}>Video File / Link</Text>
        <View style={styles.uploadArea}>
          <Text style={styles.uploadIcon}>🎬</Text>
          <Text style={styles.uploadText}>Tap to select dance video file</Text>
        </View>

        <TouchableOpacity style={styles.submitBtn} activeOpacity={0.8}>
          <Text style={styles.submitBtnText}>Submit Entry</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080B0D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  backText: {
    color: '#E6C36E',
    fontSize: 14,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    padding: 20,
  },
  label: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.22)',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 13,
  },
  uploadArea: {
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.22)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 24,
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  uploadText: {
    color: '#9E988D',
    fontSize: 12,
  },
  submitBtn: {
    backgroundColor: '#D4A446',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#080B0D',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default UploadSubmissionScreen;
