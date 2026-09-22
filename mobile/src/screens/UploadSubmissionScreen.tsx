import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { competitionApi, CompetitionDetails } from '../services/competitionApi';
import { submissionApi } from '../services/submissionApi';
import StepIndicator from '../components/submission/StepIndicator';
import MediaPicker from '../components/submission/MediaPicker';
import MediaPreview from '../components/submission/MediaPreview';
import SubmissionForm from '../components/submission/SubmissionForm';
import SubmissionReview from '../components/submission/SubmissionReview';
import SubmissionStatus from '../components/submission/SubmissionStatus';
import PrimaryButton from '../components/PrimaryButton';
import LoadingState from '../components/LoadingState';

interface SelectedMedia {
  uri: string;
  name?: string;
  fileSize?: number;
  type?: string;
  duration?: number | null;
}

export const UploadSubmissionScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { user, isAuthenticated } = useAuth();
  const routeCompId = route?.params?.competitionId || route?.params?.id;

  const [step, setStep] = useState<number>(1);
  const [competitions, setCompetitions] = useState<CompetitionDetails[]>([]);
  const [selectedCompId, setSelectedCompId] = useState<string>(routeCompId || '');
  const [loadingComps, setLoadingComps] = useState<boolean>(true);

  // Selected Media State
  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia | null>({
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    name: 'classical_kathak_solo_performance.mp4',
    fileSize: 15728640,
    type: 'video/mp4',
    duration: 150,
  });

  // Form Details State
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Submission Progress & Status State
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submissionId, setSubmissionId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Sync competition ID whenever route params update
  useEffect(() => {
    const currentParamId = route?.params?.competitionId || route?.params?.id;
    if (currentParamId) {
      setSelectedCompId(currentParamId);
    }
  }, [route?.params?.competitionId, route?.params?.id]);

  useEffect(() => {
    async function loadCompetitions() {
      setLoadingComps(true);
      const res = await competitionApi.getAllCompetitions();
      if (res.success && res.data) {
        setCompetitions(res.data);
        const currentParamId = route?.params?.competitionId || route?.params?.id;
        if (currentParamId) {
          setSelectedCompId(currentParamId);
        } else if (!selectedCompId && res.data.length > 0) {
          setSelectedCompId(res.data[0].id || res.data[0]._id);
        }
      }
      setLoadingComps(false);
    }
    loadCompetitions();
  }, []);

  const activeCompId = selectedCompId || route?.params?.competitionId || route?.params?.id;

  const selectedCompetition = competitions.find(
    (c) => (c.id || c._id) === activeCompId
  ) || (activeCompId ? ({ id: activeCompId, _id: activeCompId, title: 'Selected Competition' } as CompetitionDetails) : undefined);

  const handleNext = () => {
    if (step === 1) {
      if (!selectedMedia || !selectedMedia.uri) {
        Alert.alert('Media Required', 'Please select a video file to continue.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!title.trim()) {
        Alert.alert('Title Required', 'Please enter a title for your performance submission.');
        return;
      }
      if (!activeCompId) {
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
    const finalCompId = activeCompId;
    if (!finalCompId || !selectedMedia) {
      Alert.alert('Error', 'Missing target competition or media file.');
      return;
    }

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
      competitionId: finalCompId,
      userId: user?.id,
      title: title.trim(),
      description: description.trim(),
      videoUrl: selectedMedia.uri,
    });

    setSubmitting(false);

    if (res.success && res.data) {
      setSubmissionId(res.data.submissionId || (res.data as any)._id);
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
        <SubmissionStatus
          submissionId={submissionId}
          title={title}
          competitionTitle={selectedCompetition?.title}
          onGoToMyCompetitions={() => navigation.navigate('MainTabs', { screen: 'MyCompetitions' })}
          onGoToDetails={() =>
            navigation.navigate('CompetitionDetails', { id: activeCompId })
          }
        />
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
      <StepIndicator currentStep={step} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>⚠️ {error}</Text>
          </View>
        )}

        {/* STEP 1: SELECT MEDIA */}
        {step === 1 && (
          <View>
            {!selectedMedia ? (
              <MediaPicker onMediaSelect={(media) => setSelectedMedia(media)} />
            ) : (
              <>
                <MediaPreview
                  uri={selectedMedia.uri}
                  fileName={selectedMedia.name}
                  fileSize={selectedMedia.fileSize}
                  type={selectedMedia.type}
                  duration={selectedMedia.duration}
                  onChangeMedia={() => setSelectedMedia(null)}
                  onRemoveMedia={() => setSelectedMedia(null)}
                />

                <PrimaryButton
                  title="Next: Entry Details →"
                  onPress={handleNext}
                  style={{ marginTop: 12 }}
                />
              </>
            )}
          </View>
        )}

        {/* STEP 2: PERFORMANCE DETAILS */}
        {step === 2 && (
          <View>
            <SubmissionForm
              competition={selectedCompetition}
              title={title}
              description={description}
              onChangeTitle={setTitle}
              onChangeDescription={setDescription}
            />

            <PrimaryButton
              title="Next: Review Entry →"
              onPress={handleNext}
              style={{ marginTop: 16 }}
            />
          </View>
        )}

        {/* STEP 3: REVIEW & SUBMIT */}
        {step === 3 && (
          <SubmissionReview
            competition={selectedCompetition}
            title={title}
            description={description}
            mediaUri={selectedMedia?.uri || ''}
            mediaFileName={selectedMedia?.name}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
});

export default UploadSubmissionScreen;
