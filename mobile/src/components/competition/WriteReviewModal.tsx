import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface WriteReviewModalProps {
  visible: boolean;
  competitionTitle: string;
  loading: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  visible,
  competitionTitle,
  loading,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStarPress = (val: number) => {
    setRating(val);
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setErrorMsg('Please enter your review feedback.');
      return;
    }
    if (comment.trim().length < 5) {
      setErrorMsg('Review comment must be at least 5 characters long.');
      return;
    }

    try {
      setErrorMsg(null);
      await onSubmit(rating, comment.trim());
      setComment('');
      setRating(5);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to submit review.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.dragHandle} />

              <View style={styles.headerRow}>
                <Text style={styles.badgeLabel}>WRITE A REVIEW</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.title}>{competitionTitle}</Text>
              <Text style={styles.subtitle}>Rate your experience and share feedback for artists</Text>

              {/* STAR RATING SELECTOR */}
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingLabel}>Your Rating</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <TouchableOpacity
                      key={starVal}
                      onPress={() => handleStarPress(starVal)}
                      activeOpacity={0.7}
                      style={styles.starTouchArea}
                    >
                      <Text style={[styles.starChar, starVal <= rating && styles.starCharSelected]}>
                        ★
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.ratingTextScore}>
                  {rating === 5
                    ? '5.0 (Excellent)'
                    : rating === 4
                    ? '4.0 (Very Good)'
                    : rating === 3
                    ? '3.0 (Good)'
                    : rating === 2
                    ? '2.0 (Fair)'
                    : '1.0 (Poor)'}
                </Text>
              </View>

              {/* COMMENT INPUT */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Your Feedback / Comment</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Share your experience, organization feedback, or appreciation..."
                  placeholderTextColor="#6B7280"
                  multiline
                  numberOfLines={4}
                  maxLength={500}
                  value={comment}
                  onChangeText={(txt) => {
                    setComment(txt);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  textAlignVertical="top"
                />
                <Text style={styles.charCounter}>{comment.length} / 500</Text>
              </View>

              {errorMsg && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
                </View>
              )}

              {/* ACTION BUTTONS */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={onClose}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleSubmit}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={['#E6C36E', '#C09331']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.submitGradient}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#080B0D" />
                    ) : (
                      <Text style={styles.submitBtnText}>Submit Review</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#11161B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(217, 164, 65, 0.3)',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
  },
  dragHandle: {
    width: 36,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeLabel: {
    color: '#D4A446',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  closeButton: {
    padding: 4,
  },
  closeIcon: {
    color: '#9E988D',
    fontSize: 18,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#9E988D',
    fontSize: 11,
    marginBottom: 16,
  },
  ratingContainer: {
    backgroundColor: '#181E24',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  ratingLabel: {
    color: '#9E988D',
    fontSize: 11,
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  starTouchArea: {
    padding: 4,
  },
  starChar: {
    fontSize: 32,
    color: '#374151',
  },
  starCharSelected: {
    color: '#FBBF24',
  },
  ratingTextScore: {
    color: '#F5DE98',
    fontSize: 12,
    fontWeight: '700',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#9E988D',
    fontSize: 11,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#181E24',
    borderColor: 'rgba(217, 164, 65, 0.25)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 13,
    minHeight: 90,
  },
  charCounter: {
    color: '#6B7280',
    fontSize: 10,
    textAlign: 'right',
    marginTop: 4,
  },
  errorBox: {
    backgroundColor: '#93000A',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#FFDAD6',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#1E252D',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelBtnText: {
    color: '#E1E2E5',
    fontSize: 14,
    fontWeight: '600',
  },
  submitBtn: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#080B0D',
    fontSize: 14,
    fontWeight: '800',
  },
});
