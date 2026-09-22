import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { competitionApi, CompetitionDetails } from '../services/competitionApi';
import { participationApi, ParticipationState } from '../services/participationApi';
import { reviewApi, ReviewItem, ReviewStats } from '../services/reviewApi';
import { useAuth } from '../context/AuthContext';
import { useCountdown } from '../hooks/useCountdown';
import { getCompetitionCTA, CTAConfig } from '../utils/ctaHelper';
import { RegistrationModal } from '../components/competition/RegistrationModal';
import { WriteReviewModal } from '../components/competition/WriteReviewModal';
import { ReviewsSection } from '../components/competition/ReviewsSection';

const { width } = Dimensions.get('window');

interface Props {
  navigation?: any;
  route?: any;
}

export const CompetitionDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated } = useAuth();
  const targetId = route?.params?.id || route?.params?.competitionId;

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [competition, setCompetition] = useState<CompetitionDetails | null>(null);
  const [participation, setParticipation] = useState<ParticipationState | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'about' | 'judging' | 'rules'>('about');

  // Modals & Action States
  const [showRegModal, setShowRegModal] = useState<boolean>(false);
  const [showWriteReviewModal, setShowWriteReviewModal] = useState<boolean>(false);
  const [submitReviewLoading, setSubmitReviewLoading] = useState<boolean>(false);

  // Registration Action State (Button lock & feedback)
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);

  // Target date resolution for countdown hook
  let targetCountdownDate: string | undefined = undefined;
  let countdownLabelPrefix = 'Registration closes in';

  if (competition) {
    if (competition.currentState === 'REGISTRATION_OPEN') {
      targetCountdownDate = competition.registrationEnd;
      countdownLabelPrefix = 'Registration closes in';
    } else if (competition.currentState === 'SUBMISSION_OPEN') {
      targetCountdownDate = competition.submissionEnd;
      countdownLabelPrefix = 'Submission ends in';
    } else if (competition.currentState === 'JUDGING') {
      targetCountdownDate = competition.resultDate;
      countdownLabelPrefix = 'Results announced in';
    } else {
      targetCountdownDate = competition.registrationEnd;
    }
  }

  const { countdownText, countdownLabel } = useCountdown(targetCountdownDate, countdownLabelPrefix);

  const fetchScreenData = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);
    setRegisterError(null);

    try {
      // 1. Resolve Competition ID (if not passed via route, fetch list & pick first)
      let compId = targetId;
      if (!compId) {
        const listRes = await competitionApi.getAllCompetitions();
        if (listRes.success && listRes.data && listRes.data.length > 0) {
          compId = listRes.data[0].id || listRes.data[0]._id;
        }
      }

      if (!compId) {
        setError('No competition found. Ensure backend database is seeded.');
        setLoading(false);
        return;
      }

      // 2. Fetch Competition Details
      const compRes = await competitionApi.getCompetitionDetails(compId, user?.id);
      if (!compRes.success || !compRes.data) {
        const errMsg = typeof compRes.error === 'string' 
          ? compRes.error 
          : compRes.error?.message || 'Unable to load competition details.';
        setError(errMsg);
        setLoading(false);
        return;
      }

      setCompetition(compRes.data);

      // 3. Fetch Participation Status for current user
      if (user?.id) {
        const partRes = await participationApi.getUserStatus(compId, user.id);
        if (partRes.success && partRes.data) {
          setParticipation(partRes.data);
        }
      } else {
        setParticipation(null);
      }

      // 4. Fetch Reviews
      const revRes = await reviewApi.getCompetitionReviews(compId);
      if (revRes.success && revRes.data) {
        setReviews(revRes.data);
        if (revRes.stats) {
          setReviewStats(revRes.stats);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to connect to server. Please check your connection and retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [targetId, user?.id]);

  useEffect(() => {
    fetchScreenData(true);
  }, [fetchScreenData]);

  // Pull to refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchScreenData(false);
  };

  // Registration Handler -> Opens Confirmation Modal
  const handleRegisterPress = () => {
    if (!competition || registerLoading) return;

    if (!isAuthenticated) {
      Alert.alert('Sign In Required', 'Please sign in or create an account to register for this competition.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => navigation?.navigate?.('Auth') },
      ]);
      return;
    }

    setShowRegModal(true);
  };

  // Registration Confirmation Handler (Triggers Backend API)
  const handleRegisterConfirm = async () => {
    if (!competition || registerLoading) return;
    setRegisterLoading(true);
    setRegisterError(null);
    setRegisterSuccess(null);

    const compId = competition.id || competition._id;
    const res = await participationApi.registerForCompetition(compId);

    setRegisterLoading(false);

    if (res.success) {
      setShowRegModal(false);
      setRegisterSuccess('Successfully registered!');
      Alert.alert('Registration Successful', `You are registered for ${competition.title}!`);
      fetchScreenData(false); // Authoritative server re-fetch
    } else {
      const errorMsg = typeof res.error === 'string'
        ? res.error
        : res.error?.message || 'Registration failed.';
      setRegisterError(errorMsg);
      Alert.alert('Registration Failed', errorMsg);
    }
  };

  // Review Handlers
  const handleWriteReviewPress = () => {
    if (!isAuthenticated) {
      Alert.alert('Sign In Required', 'Please sign in to write a review for this competition.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => navigation?.navigate?.('Auth') },
      ]);
      return;
    }
    setShowWriteReviewModal(true);
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!competition) return;
    setSubmitReviewLoading(true);

    const compId = competition.id || competition._id;
    const res = await reviewApi.submitReview(compId, { rating, comment });

    setSubmitReviewLoading(false);

    if (res.success) {
      setShowWriteReviewModal(false);
      Alert.alert('Review Submitted', 'Thank you for your valuable feedback!');
      fetchScreenData(false);
    } else {
      const errorMsg = typeof res.error === 'string'
        ? res.error
        : res.error?.message || 'Failed to submit review.';
      throw new Error(errorMsg);
    }
  };

  // Date Formatting Helper
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'TBA';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  // Render Primary CTA using reusable helper
  const ctaConfig: CTAConfig = getCompetitionCTA(competition, participation, registerLoading);

  const handleCTAPress = () => {
    if (ctaConfig.disabled) return;
    if (ctaConfig.actionType === 'REGISTER') {
      handleRegisterPress();
    } else if (ctaConfig.actionType === 'UPLOAD_SUBMISSION') {
      navigation?.navigate?.('UploadSubmission', { competitionId: competition?.id || competition?._id });
    } else if (ctaConfig.actionType === 'VIEW_RESULTS') {
      Alert.alert('Results Announcement', 'The official winners have been published! Check the leaderboard section.');
    }
  };

  // -------------------------------------------------------------
  // LOADING STATE
  // -------------------------------------------------------------
  if (loading) {
    return (
      <SafeAreaView style={styles.containerCenter}>
        <StatusBar barStyle="light-content" backgroundColor="#090D10" />
        <ActivityIndicator size="large" color="#D4A446" />
        <Text style={styles.loadingText}>Loading competition details...</Text>
      </SafeAreaView>
    );
  }

  // -------------------------------------------------------------
  // ERROR STATE WITH RETRY
  // -------------------------------------------------------------
  if (error || !competition) {
    return (
      <SafeAreaView style={styles.containerCenter}>
        <StatusBar barStyle="light-content" backgroundColor="#090D10" />
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Unable to load competition</Text>
        <Text style={styles.errorSubtitle}>
          {error || 'Please check your internet connection and backend server status.'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchScreenData(true)} activeOpacity={0.8}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090D10" />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack?.()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>♡</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>☍</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4A446" />}
      >
        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          <View style={styles.heroHeaderRow}>
            <View style={styles.heroLeftTags}>
              <View style={styles.categoryPill}>
                <Text style={styles.categoryText}>{competition.category || 'Dance'}</Text>
              </View>
              <View style={styles.ratingRow}>
                <Text style={styles.starIcon}>★</Text>
                <Text style={styles.ratingScore}>4.8</Text>
                <Text style={styles.ratingCount}>({competition.registeredParticipants} registered)</Text>
              </View>
            </View>

            {/* Dynamic Status Pill */}
            <View style={styles.statusPill}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: competition.isRegistrationActive ? '#10B981' : '#EF4444' },
                ]}
              />
              <Text style={styles.statusText}>
                {competition.currentState?.replace(/_/g, ' ') || 'Registration Open'}
              </Text>
            </View>
          </View>

          <View style={styles.heroBody}>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>{competition.title}</Text>
              <Text style={styles.heroSubtitle}>{competition.description}</Text>
              <Text style={styles.heroTagline}>Art · Culture · Passion Forever</Text>
            </View>
            <Image
              source={{
                uri:
                  competition.images?.heroImage ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuCOASx6Mo2Vh7okDWxb2wHJ7rIFwn_VpN6wNlGJDg1rpQoX2hXlh4Vu0nExFPXIR1g7P_sCgjJuVoyudUarLHfvejcWgdKYwQrC-Vp6JYzdg8YCuezELwrwwdQp0VQRV1Ayzx11ktwD6HKiLOVGAWo8s0q9v2J1AnJHC8g3zhhLw5O0kYOVPhynAQPIs-w8yqD9NydUHCqeUHrKmDUVILVmmRpGkr8dsNcGh26ImdzyA-aE-EMIN-3a-58lO4_LZ4XbBtg',
              }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* REGISTRATION ERROR / SUCCESS BANNER */}
        {registerError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>⚠️ {registerError}</Text>
          </View>
        )}
        {registerSuccess && (
          <View style={styles.successBanner}>
            <Text style={styles.successBannerText}>🎉 {registerSuccess}</Text>
          </View>
        )}

        {/* KEY METRICS GRID (DYNAMIC FROM BACKEND) */}
        <View style={styles.metricsGrid}>
          {/* Prize Pool */}
          <View style={styles.metricCard}>
            <View style={styles.metricIconBg}>
              <Text style={styles.metricSymbol}>🏆</Text>
            </View>
            <View style={styles.metricTextGroup}>
              <Text style={styles.metricLabel}>Prize Pool</Text>
              <Text style={styles.metricValue}>₹ {competition.prizePool?.toLocaleString('en-IN')}</Text>
            </View>
          </View>

          {/* Entry Fee */}
          <View style={styles.metricCard}>
            <View style={styles.metricIconBg}>
              <Text style={styles.metricSymbol}>🎟️</Text>
            </View>
            <View style={styles.metricTextGroup}>
              <Text style={styles.metricLabel}>Entry Fee</Text>
              <Text style={styles.metricValue}>₹ {competition.entryFee}</Text>
            </View>
          </View>

          {/* Dynamic Spots Left */}
          <View style={styles.metricCardSpots}>
            <View style={styles.spotsHeader}>
              <Text style={styles.spotsIcon}>👥</Text>
              <Text style={styles.spotsTitle}>
                {competition.remainingSpots > 0
                  ? `Only ${competition.remainingSpots} spots left`
                  : 'Registration Full'}
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${Math.min(
                      100,
                      Math.round((competition.registeredParticipants / (competition.maxParticipants || 1)) * 100)
                    )}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.spotsCounterText}>
              <Text style={{ color: '#FFF', fontWeight: '700' }}>{competition.registeredParticipants}</Text> /{' '}
              {competition.maxParticipants} Registered
            </Text>
          </View>
        </View>

        {/* DYNAMIC JUDGE CARD */}
        {competition.judge && (
          <View style={styles.judgeCard}>
            <View style={styles.judgeProfileGroup}>
              <Image
                source={{
                  uri:
                    competition.judge.image ||
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuAFNqHvMzh8Ui713VpHW6BZzYr04_AlGdM_I85e5SBNFnvDP11T82QPxOCrRHNkR6SsFMzLUn2UW64jKR2C1iPk3xHMDtxBXujSb9OxMwlqKpOBs9xF0SwmAW9m7Bg-esLna4oUfsXltfrxTRTWJsz71PF7miTHgPpq0Iv3s0pTHgZ7JidB5W3EaRRgatw_goZNwPKNCJo00VoyeA228pJryCzWi13v1qZXveE933S5uWP35lHJFo0hF8HGFPKvu6UpNOs',
                }}
                style={styles.judgeAvatar}
              />
              <View>
                <Text style={styles.judgeRoleLabel}>JUDGE</Text>
                <Text style={styles.judgeName}>{competition.judge.name}</Text>
                <Text style={styles.judgeTitle}>{competition.judge.profession}</Text>
                <Text style={styles.judgeExp}>{competition.judge.experience}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.watchVideoButton} activeOpacity={0.8}>
              <View style={styles.playCircle}>
                <Text style={styles.playTriangle}>▶</Text>
              </View>
              <Text style={styles.watchVideoText}>Watch Video</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* DYNAMIC COUNTDOWN BANNER */}
        <View style={styles.countdownBanner}>
          <View style={styles.countdownLeft}>
            <Text style={styles.clockIcon}>⏳</Text>
            <Text style={styles.countdownLabel}>{countdownLabel}</Text>
          </View>
          <Text style={styles.timerMonoText}>{countdownText}</Text>
          <View style={styles.hurryBadge}>
            <Text style={styles.hurryText}>Hurry up!</Text>
          </View>
        </View>

        {/* DYNAMIC IMPORTANT DATES */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Important Dates</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.datesGrid}>
          <View style={styles.dateCard}>
            <Text style={styles.dateCardIcon}>📅</Text>
            <View>
              <Text style={styles.dateCardLabel}>Registration Starts</Text>
              <Text style={styles.dateCardValue}>{formatDate(competition.registrationStart)}</Text>
              <Text style={styles.dateCardTime}>{formatTime(competition.registrationStart)}</Text>
            </View>
          </View>
          <View style={styles.dateCard}>
            <Text style={styles.dateCardIcon}>📤</Text>
            <View>
              <Text style={styles.dateCardLabel}>Submission Starts</Text>
              <Text style={styles.dateCardValue}>{formatDate(competition.submissionStart)}</Text>
              <Text style={styles.dateCardTime}>{formatTime(competition.submissionStart)}</Text>
            </View>
          </View>
          <View style={styles.dateCard}>
            <Text style={styles.dateCardIcon}>⏰</Text>
            <View>
              <Text style={styles.dateCardLabel}>Submission Ends</Text>
              <Text style={styles.dateCardValue}>{formatDate(competition.submissionEnd)}</Text>
              <Text style={styles.dateCardTime}>{formatTime(competition.submissionEnd)}</Text>
            </View>
          </View>
          <View style={styles.dateCard}>
            <Text style={styles.dateCardIcon}>🏆</Text>
            <View>
              <Text style={styles.dateCardLabel}>Result Date</Text>
              <Text style={styles.dateCardValue}>{formatDate(competition.resultDate)}</Text>
              <Text style={styles.dateCardTime}>{formatTime(competition.resultDate)}</Text>
            </View>
          </View>
        </View>

        {/* DYNAMIC PREVIOUS WINNERS */}
        {competition.previousWinners && competition.previousWinners.length > 0 && (
          <>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Previous Winners</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.winnersCarousel}
            >
              {competition.previousWinners.map((winner, idx) => (
                <View key={idx} style={styles.winnerCard}>
                  <Image source={{ uri: winner.image }} style={styles.winnerAvatar} />
                  <View style={styles.winnerInfo}>
                    <Text style={styles.winnerName} numberOfLines={1}>
                      {winner.name}
                    </Text>
                    <Text style={styles.winnerBadge}>{winner.position}</Text>
                    {winner.prizeAmount ? (
                      <Text style={{ color: '#D4A446', fontSize: 9, fontWeight: '700', marginTop: 1 }}>
                        {winner.prizeAmount}
                      </Text>
                    ) : null}
                  </View>
                </View>
              ))}
            </ScrollView>
          </>
        )}

        {/* DYNAMIC TABS SECTION */}
        <View style={styles.tabsHeader}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'about' && styles.tabButtonActive]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.tabTextActive]}>
              About Competition
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'judging' && styles.tabButtonActive]}
            onPress={() => setActiveTab('judging')}
          >
            <Text style={[styles.tabText, activeTab === 'judging' && styles.tabTextActive]}>
              Judging Parameters
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'rules' && styles.tabButtonActive]}
            onPress={() => setActiveTab('rules')}
          >
            <Text style={[styles.tabText, activeTab === 'rules' && styles.tabTextActive]}>
              Rules & Eligibility
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContentBox}>
          {activeTab === 'about' && (
            <Text style={styles.tabDescription}>{competition.description}</Text>
          )}
          {activeTab === 'judging' && (
            <Text style={styles.tabDescription}>{competition.judgingParameters}</Text>
          )}
          {activeTab === 'rules' && (
            <View>
              <Text style={[styles.tabDescription, { fontWeight: '700', marginBottom: 4 }]}>Rules:</Text>
              <Text style={styles.tabDescription}>{competition.rules}</Text>
              <Text style={[styles.tabDescription, { fontWeight: '700', marginTop: 8, marginBottom: 4 }]}>
                Eligibility:
              </Text>
              <Text style={styles.tabDescription}>{competition.eligibility}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.readMoreButton}>
            <Text style={styles.readMoreText}>Read more ▼</Text>
          </TouchableOpacity>
        </View>

        {/* DYNAMIC REWARDS SECTION */}
        {competition.rewards && competition.rewards.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <View style={styles.rewardsHeader}>
              <Text style={styles.sectionTitle}>Rewards</Text>
              <Text style={styles.rewardsSubLabel}>(All positions)</Text>
            </View>

            <View style={styles.rewardsGrid}>
              {competition.rewards.map((reward, idx) => (
                <View key={idx} style={styles.rewardTierCard}>
                  <Text style={styles.rewardIcon}>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '⭐'}
                  </Text>
                  <Text style={styles.rewardRank} numberOfLines={1}>
                    {reward.position}
                  </Text>
                  <Text style={styles.rewardAmount}>₹ {reward.amount}</Text>
                </View>
              ))}
            </View>

            <View style={styles.incentivesBanner}>
              <Text style={styles.giftIcon}>🎁</Text>
              <Text style={styles.incentivesText}>
                <Text style={{ color: '#F5DE98', fontWeight: '700' }}>Incentives: </Text>
                Only contributions from paid participants will be considered for judging.
              </Text>
            </View>
          </View>
        )}

        {/* REVIEWS SECTION COMPONENT */}
        <ReviewsSection
          reviews={reviews}
          stats={reviewStats}
          onWriteReviewPress={handleWriteReviewPress}
        />

        <View style={{ height: 100 + insets.bottom }} />
      </ScrollView>

      {/* FIXED STICKY FOOTER CTA (DYNAMIC) */}
      <View style={[styles.footerStickyBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          style={styles.ctaButton}
          activeOpacity={ctaConfig.disabled ? 1 : 0.85}
          onPress={handleCTAPress}
          disabled={ctaConfig.disabled}
        >
          <LinearGradient colors={ctaConfig.gradientColors} style={styles.gradientCta}>
            {registerLoading ? (
              <ActivityIndicator size="small" color="#080B0D" />
            ) : (
              <Text style={styles.ctaIcon}>{ctaConfig.icon}</Text>
            )}
            <View>
              <Text style={styles.ctaTitle}>{ctaConfig.text}</Text>
              {ctaConfig.subText && <Text style={styles.ctaSub}>{ctaConfig.subText}</Text>}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* REGISTRATION CONFIRMATION MODAL */}
      <RegistrationModal
        visible={showRegModal}
        competition={competition}
        loading={registerLoading}
        onClose={() => setShowRegModal(false)}
        onConfirm={handleRegisterConfirm}
      />

      {/* WRITE REVIEW MODAL */}
      <WriteReviewModal
        visible={showWriteReviewModal}
        competitionTitle={competition.title}
        loading={submitReviewLoading}
        onClose={() => setShowWriteReviewModal(false)}
        onSubmit={handleReviewSubmit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerCenter: {
    flex: 1,
    backgroundColor: '#080B0D',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#D4A446',
    fontSize: 14,
    marginTop: 12,
    fontWeight: '600',
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorSubtitle: {
    color: '#9E988D',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  retryButton: {
    backgroundColor: '#D4A446',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#080B0D',
    fontSize: 14,
    fontWeight: '700',
  },

  container: {
    flex: 1,
    backgroundColor: '#080B0D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#090D10',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    color: '#D3C4B1',
    fontSize: 18,
    marginRight: 6,
  },
  backText: {
    color: '#E1E2E5',
    fontSize: 14,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 6,
  },
  actionIcon: {
    color: '#E1E2E5',
    fontSize: 20,
  },
  scrollContent: {
    paddingBottom: 24,
  },

  errorBanner: {
    backgroundColor: '#93000A',
    marginHorizontal: 16,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorBannerText: {
    color: '#FFDAD6',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  successBanner: {
    backgroundColor: '#052A20',
    borderColor: '#137854',
    borderWidth: 1,
    marginHorizontal: 16,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  successBannerText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },

  heroSection: {
    padding: 16,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  heroLeftTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryPill: {
    backgroundColor: '#1C2228',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#374151',
  },
  categoryText: {
    color: '#E1E2E5',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starIcon: {
    color: '#FBBF24',
    fontSize: 12,
  },
  ratingScore: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  ratingCount: {
    color: '#9CA3AF',
    fontSize: 11,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#052A20',
    borderColor: '#137854',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  heroBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: '#9E988D',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  heroTagline: {
    color: '#D4A446',
    fontSize: 11,
    fontStyle: 'italic',
  },
  heroImage: {
    width: 100,
    height: 120,
    borderRadius: 12,
    opacity: 0.85,
  },

  metricsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.22)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricIconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(212, 164, 70, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricSymbol: {
    fontSize: 16,
  },
  metricTextGroup: {
    flex: 1,
  },
  metricLabel: {
    color: '#9E988D',
    fontSize: 10,
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  metricCardSpots: {
    flex: 1.2,
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.22)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    justifyContent: 'space-between',
  },
  spotsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  spotsIcon: {
    fontSize: 12,
  },
  spotsTitle: {
    color: '#E6C36E',
    fontSize: 11,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#262626',
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#E6C36E',
    borderRadius: 3,
  },
  spotsCounterText: {
    color: '#9E988D',
    fontSize: 9,
    textAlign: 'right',
  },

  judgeCard: {
    marginHorizontal: 16,
    backgroundColor: '#12171B',
    borderColor: 'rgba(217, 164, 65, 0.22)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  judgeProfileGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  judgeAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(217, 164, 65, 0.4)',
  },
  judgeRoleLabel: {
    color: '#9E988D',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  judgeName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  judgeTitle: {
    color: '#D1D5DB',
    fontSize: 11,
  },
  judgeExp: {
    color: '#9CA3AF',
    fontSize: 10,
  },
  watchVideoButton: {
    backgroundColor: '#212930',
    borderColor: '#374151',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playTriangle: {
    color: '#000000',
    fontSize: 8,
    marginLeft: 1,
  },
  watchVideoText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },

  countdownBanner: {
    marginHorizontal: 16,
    backgroundColor: '#13191D',
    borderColor: 'rgba(217, 164, 65, 0.22)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  countdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clockIcon: {
    fontSize: 14,
  },
  countdownLabel: {
    color: '#D1D5DB',
    fontSize: 11,
  },
  timerMonoText: {
    color: '#F5DE98',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  hurryBadge: {
    backgroundColor: 'rgba(212, 164, 70, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  hurryText: {
    color: '#E6C36E',
    fontSize: 10,
    fontWeight: '700',
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  viewAllText: {
    color: '#E6C36E',
    fontSize: 12,
    fontWeight: '500',
  },

  datesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 20,
  },
  dateCard: {
    width: (width - 40) / 2,
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.12)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  dateCardIcon: {
    fontSize: 16,
  },
  dateCardLabel: {
    color: '#9E988D',
    fontSize: 10,
  },
  dateCardValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  dateCardTime: {
    color: '#9E988D',
    fontSize: 10,
  },

  winnersCarousel: {
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  winnerCard: {
    backgroundColor: '#12171B',
    borderColor: 'rgba(217, 164, 65, 0.12)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 145,
  },
  winnerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  winnerInfo: {
    flex: 1,
  },
  winnerName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  winnerBadge: {
    color: '#E6C36E',
    fontSize: 10,
    marginTop: 2,
  },

  tabsHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  tabButton: {
    paddingVertical: 10,
    marginRight: 16,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#E6C36E',
  },
  tabText: {
    color: '#9E988D',
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#E6C36E',
    fontWeight: '700',
  },
  tabContentBox: {
    marginHorizontal: 16,
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.22)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  tabDescription: {
    color: '#D1D5DB',
    fontSize: 12,
    lineHeight: 18,
  },
  readMoreButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  readMoreText: {
    color: '#E6C36E',
    fontSize: 11,
    fontWeight: '700',
  },

  rewardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  rewardsSubLabel: {
    color: '#9E988D',
    fontSize: 11,
  },
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 12,
  },
  rewardTierCard: {
    width: (width - 62) / 6,
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.12)',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  rewardIcon: {
    fontSize: 14,
    marginBottom: 2,
  },
  rewardRank: {
    color: '#9E988D',
    fontSize: 8,
    textAlign: 'center',
  },
  rewardAmount: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  incentivesBanner: {
    marginHorizontal: 16,
    backgroundColor: '#13191E',
    borderColor: 'rgba(217, 164, 65, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  giftIcon: {
    fontSize: 16,
  },
  incentivesText: {
    color: '#D1D5DB',
    fontSize: 11,
    flex: 1,
  },

  trustGrid: {
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  referLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  referTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  referSub: {
    color: '#9E988D',
    fontSize: 10,
  },
  reviewsCard: {
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.12)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewsIcon: {
    fontSize: 20,
  },
  arrowIcon: {
    color: '#9E988D',
    fontSize: 20,
  },

  footerStickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#090D10',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  ctaButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientCta: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaIcon: {
    fontSize: 18,
  },
  ctaTitle: {
    color: '#080B0D',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  ctaSub: {
    color: '#080B0D',
    fontSize: 10,
    fontWeight: '600',
    opacity: 0.85,
  },
});

export default CompetitionDetailsScreen;
