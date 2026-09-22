import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { competitionApi, CompetitionDetails } from '../services/competitionApi';
import { submissionApi } from '../services/submissionApi';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import LoadingState from '../components/LoadingState';

export const UploadSubmissionScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { user, isAuthenticated } = useAuth();
  const initialCompId = route?.params?.competitionId || route?.params?.id;

  const [step, setStep] = useState<number>(1);
  const [competitions, setCompetitions] = useState<CompetitionDetails[]>([]);
  const [selectedCompId, setSelectedCompId] = useState<string>(initialCompId || '');
  const [loadingComps, setLoadingComps] = useState<boolean>(true);

  // Form State
  const [videoUrl, setVideoUrl] = useState<string>(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  );
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  
  // Submission Status State
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submissionId, setSubmissionId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCompetitions() {
      setLoadingComps(true);
      const res = await competitionApi.getAllCompetitions();
      if (res.success && res.data) {
        setCompetitions(res.data);
        if (!selectedCompId && res.data.length > 0) {
          setSelectedCompId(res.data[0].id || res.data[0]._id);
        }
      }
      setLoadingComps(false);
    }
    loadCompetitions();
  }, [initialCompId]);

  const selectedCompetition = competitions.find(
    (c) => (c.id || c._id) === selectedCompId
  );

  const handleNext = () => {
    if (step === 1) {
      if (!videoUrl.trim()) {
        Alert.alert('Video Required', 'Please provide a valid media file link or URL.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!title.trim()) {
        Alert.alert('Title Required', 'Please enter a title for your performance.');
        return;
      }
      if (!selectedCompId) {
        Alert.alert('Competition Required', 'Please select a competition for this submission.');
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSubmit = async () => {
    if (!selectedCompId) return;

    if (!isAuthenticated) {
      Alert.alert('Sign In Required', 'Please sign in or create an account to upload a competition entry.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => navigation.navigate('Auth') },
      ]);
      return;
    }

    setSubmitting(true);
    setError(null);

    const res = await submissionApi.submitEntry({
      competitionId: selectedCompId,
      userId: user?.id,
      title: title.trim(),
      description: description.trim(),
      videoUrl: videoUrl.trim(),
    });

    setSubmitting(false);

    if (res.success && res.data) {
      setSubmissionId(res.data.submissionId);
      setIsSubmitted(true);
    } else {
      const errMsg = typeof res.error === 'string' ? res.error : res.error?.message || 'Submission failed.';
      setError(errMsg);
      Alert.alert('Submission Error', errMsg);
    }
  };

  if (loadingComps) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#090D10" />
        <LoadingState message="Loading submission portal..." />
      </SafeAreaView>
    );
  }

  // SUCCESS STATE ("Submission Under Review")
  if (isSubmitted) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#090D10" />
        <ScrollView contentContainerStyle={styles.successContainer}>
          <View style={styles.successBadge}>
            <Text style={styles.successIcon}>⏳</Text>
          </View>
          <Text style={styles.successTitle}>Submission Under Review</Text>
          <Text style={styles.successSubtitle}>
            Your performance entry has been successfully submitted to the panel.
          </Text>

          <View style={styles.reviewSummaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Submission ID:</Text>
              <Text style={styles.summaryValue}>{submissionId || 'SUB-2026-8841'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Title:</Text>
              <Text style={styles.summaryValue}>{title}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Competition:</Text>
              <Text style={styles.summaryValue}>{selectedCompetition?.title}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Status:</Text>
              <View style={styles.statusPill}>
                <Text style={styles.statusText}>UNDER REVIEW</Text>
              </View>
            </View>
          </View>

          <PrimaryButton
            title="Go to My Competitions"
            onPress={() => navigation.navigate('MainTabs', { screen: 'MyCompetitions' })}
            style={{ width: '100%', marginBottom: 12 }}
          />

          <SecondaryButton
            title="Back to Home"
            onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
            style={{ width: '100%' }}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090D10" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Performance</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* STEP INDICATOR */}
      <View style={styles.stepIndicatorContainer}>
        <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]}>
          <Text style={[styles.stepNum, step >= 1 && styles.stepNumActive]}>1</Text>
        </View>
        <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
        <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]}>
          <Text style={[styles.stepNum, step >= 2 && styles.stepNumActive]}>2</Text>
        </View>
        <View style={[styles.stepLine, step >= 3 && styles.stepLineActive]} />
        <View style={[styles.stepDot, step >= 3 && styles.stepDotActive]}>
          <Text style={[styles.stepNum, step >= 3 && styles.stepNumActive]}>3</Text>
        </View>
      </View>
      <View style={styles.stepLabelRow}>
        <Text style={[styles.stepLabel, step === 1 && styles.stepLabelActive]}>1. Upload</Text>
        <Text style={[styles.stepLabel, step === 2 && styles.stepLabelActive]}>2. Details</Text>
        <Text style={[styles.stepLabel, step === 3 && styles.stepLabelActive]}>3. Review</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* STEP 1: UPLOAD MEDIA */}
        {step === 1 && (
          <View>
            <Text style={styles.sectionTitle}>STEP 1: Upload Video File / URL</Text>
            <Text style={styles.sectionSub}>Select video recording or enter development media URL.</Text>

            <TouchableOpacity style={styles.uploadArea} activeOpacity={0.85}>
              <Text style={styles.uploadIcon}>🎬</Text>
              <Text style={styles.uploadAreaTitle}>Tap to choose video file</Text>
              <Text style={styles.uploadAreaSub}>MP4, MOV up to 500MB (1080p high definition)</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Development Video Link / Media URL</Text>
            <TextInput
              style={styles.input}
              value={videoUrl}
              onChangeText={setVideoUrl}
              placeholder="https://..."
              placeholderTextColor="#706C64"
            />

            {/* PREVIEW AREA */}
            <View style={styles.previewBox}>
              <Text style={styles.previewTitle}>Media Selected ✅</Text>
              <Text style={styles.previewSub} numberOfLines={1}>{videoUrl}</Text>
            </View>

            <PrimaryButton title="Next: Entry Details →" onPress={handleNext} style={{ marginTop: 24 }} />
          </View>
        )}

        {/* STEP 2: PERFORMANCE DETAILS */}
        {step === 2 && (
          <View>
            <Text style={styles.sectionTitle}>STEP 2: Performance Details</Text>
            <Text style={styles.sectionSub}>Provide competition target and performance summary.</Text>

            <Text style={styles.label}>Select Competition</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              {competitions.map((comp) => {
                const cId = comp.id || comp._id;
                const isSelected = selectedCompId === cId;
                return (
                  <TouchableOpacity
                    key={cId}
                    style={[styles.compChip, isSelected && styles.compChipActive]}
                    onPress={() => setSelectedCompId(cId)}
                  >
                    <Text style={[styles.compChipText, isSelected && styles.compChipTextActive]}>
                      {comp.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.label}>Performance Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Classical Kathak Tarana in Teen Taal"
              placeholderTextColor="#706C64"
            />

            <Text style={styles.label}>Performance Description / Raga Details</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your choreographic flow, taala, or musical raga..."
              placeholderTextColor="#706C64"
              multiline
              numberOfLines={4}
            />

            <PrimaryButton title="Next: Review Entry →" onPress={handleNext} style={{ marginTop: 24 }} />
          </View>
        )}

        {/* STEP 3: REVIEW & SUBMIT */}
        {step === 3 && (
          <View>
            <Text style={styles.sectionTitle}>STEP 3: Review & Final Submission</Text>
            <Text style={styles.sectionSub}>Verify all performance details before submitting to judges.</Text>

            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>⚠️ {error}</Text>
              </View>
            )}

            <View style={styles.reviewCard}>
              <Text style={styles.reviewCardHeader}>Performance Summary</Text>
              <View style={styles.divider} />

              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Competition:</Text>
                <Text style={styles.reviewVal}>{selectedCompetition?.title || 'Selected Contest'}</Text>
              </View>

              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Title:</Text>
                <Text style={styles.reviewVal}>{title}</Text>
              </View>

              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Description:</Text>
                <Text style={styles.reviewVal}>{description || 'None provided'}</Text>
              </View>

              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Media File:</Text>
                <Text style={styles.reviewVal} numberOfLines={1}>{videoUrl}</Text>
              </View>
            </View>

            <PrimaryButton
              title="Submit Entry Now"
              onPress={handleSubmit}
              loading={submitting}
              style={{ marginTop: 20 }}
            />
          </View>
        )}
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  backBtn: {
    paddingVertical: 4,
  },
  backText: {
    color: '#E6C36E',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1E242B',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
  stepDotActive: {
    backgroundColor: '#D4A446',
    borderColor: '#D4A446',
  },
  stepNum: {
    color: '#706C64',
    fontSize: 12,
    fontWeight: '700',
  },
  stepNumActive: {
    color: '#080B0D',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#1E242B',
  },
  stepLineActive: {
    backgroundColor: '#D4A446',
  },
  stepLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
    marginTop: 6,
    marginBottom: 16,
  },
  stepLabel: {
    color: '#706C64',
    fontSize: 11,
  },
  stepLabelActive: {
    color: '#E6C36E',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSub: {
    color: '#9E988D',
    fontSize: 12,
    marginBottom: 20,
  },
  uploadArea: {
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.3)',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  uploadIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  uploadAreaTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  uploadAreaSub: {
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
  previewBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },
  previewTitle: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  previewSub: {
    color: '#9E988D',
    fontSize: 11,
  },
  compChip: {
    backgroundColor: '#12161A',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
  },
  compChipActive: {
    backgroundColor: 'rgba(212, 164, 70, 0.2)',
    borderColor: '#D4A446',
  },
  compChipText: {
    color: '#9E988D',
    fontSize: 12,
  },
  compChipTextActive: {
    color: '#E6C36E',
    fontWeight: '700',
  },
  reviewCard: {
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.25)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  reviewCardHeader: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
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
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  errorBannerText: {
    color: '#EF4444',
    fontSize: 12,
  },
  successContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  successBadge: {
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
  successIcon: {
    fontSize: 32,
  },
  successTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  successSubtitle: {
    color: '#9E988D',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  reviewSummaryCard: {
    width: '100%',
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.25)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    color: '#9E988D',
    fontSize: 12,
  },
  summaryValue: {
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

export default UploadSubmissionScreen;
