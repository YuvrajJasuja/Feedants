import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CompetitionDetails } from '../../services/competitionApi';

interface RegistrationModalProps {
  visible: boolean;
  competition: CompetitionDetails | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  visible,
  competition,
  loading,
  onClose,
  onConfirm,
}) => {
  if (!competition) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.dragHandle} />

              <View style={styles.headerRow}>
                <Text style={styles.badgeLabel}>REGISTRATION CONFIRMATION</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.title}>{competition.title}</Text>
              <Text style={styles.categoryTag}>{competition.category} Competition</Text>

              {/* Summary Cards */}
              <View style={styles.summaryGrid}>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryLabel}>Entry Fee</Text>
                  <Text style={styles.summaryValueHighlight}>
                    {competition.entryFee > 0 ? `₹ ${competition.entryFee}` : 'FREE'}
                  </Text>
                </View>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryLabel}>Spots Remaining</Text>
                  <Text style={styles.summaryValue}>
                    {competition.remainingSpots > 0
                      ? `${competition.remainingSpots} / ${competition.maxParticipants}`
                      : 'Full'}
                  </Text>
                </View>
              </View>

              {/* Key Notes */}
              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>📌 Registration Terms</Text>
                <Text style={styles.infoBullet}>
                  • Ensure your performance video aligns with the competition rules.
                </Text>
                <Text style={styles.infoBullet}>
                  • Once registered, your spot is reserved exclusively for you.
                </Text>
                <Text style={styles.infoBullet}>
                  • Submissions will open as per the competition schedule.
                </Text>
              </View>

              {/* Payment Assumptions Disclaimer */}
              <View style={styles.paymentNoteBox}>
                <Text style={styles.paymentNoteIcon}>💳</Text>
                <Text style={styles.paymentNoteText}>
                  <Text style={{ fontWeight: '700', color: '#F5DE98' }}>Production Note: </Text>
                  In a live production environment, a payment gateway (e.g. Razorpay / Stripe) would be
                  triggered here prior to confirming registration.
                </Text>
              </View>

              {/* Action Buttons */}
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
                  style={styles.confirmBtn}
                  onPress={onConfirm}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={['#E6C36E', '#C09331']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.confirmGradient}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#080B0D" />
                    ) : (
                      <Text style={styles.confirmBtnText}>Confirm & Register</Text>
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
    marginBottom: 8,
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
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  categoryTag: {
    color: '#9E988D',
    fontSize: 12,
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#181E24',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  summaryLabel: {
    color: '#9E988D',
    fontSize: 11,
    marginBottom: 4,
  },
  summaryValueHighlight: {
    color: '#E6C36E',
    fontSize: 16,
    fontWeight: '800',
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  infoBox: {
    backgroundColor: '#181E24',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  infoTitle: {
    color: '#E1E2E5',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  infoBullet: {
    color: '#9E988D',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 4,
  },
  paymentNoteBox: {
    backgroundColor: '#141A20',
    borderColor: 'rgba(212, 164, 70, 0.25)',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  paymentNoteIcon: {
    fontSize: 16,
  },
  paymentNoteText: {
    color: '#D1D5DB',
    fontSize: 10,
    flex: 1,
    lineHeight: 14,
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
  confirmBtn: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    color: '#080B0D',
    fontSize: 14,
    fontWeight: '800',
  },
});
