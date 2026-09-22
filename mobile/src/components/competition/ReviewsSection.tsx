import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { ReviewItem, ReviewStats } from '../../services/reviewApi';

interface ReviewsSectionProps {
  reviews: ReviewItem[];
  stats?: ReviewStats;
  onWriteReviewPress: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  stats,
  onWriteReviewPress,
}) => {
  const averageRating = stats?.averageRating ?? (reviews.length > 0 ? 4.8 : 0);
  const totalCount = stats?.totalReviews ?? reviews.length;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return '';
    }
  };

  const getReviewerName = (userId: ReviewItem['userId']) => {
    if (typeof userId === 'object' && userId !== null && userId.name) {
      return userId.name;
    }
    return 'Verified Participant';
  };

  const getReviewerAvatar = (userId: ReviewItem['userId']) => {
    if (typeof userId === 'object' && userId !== null && userId.profileImage) {
      return userId.profileImage;
    }
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvuG3miwQBhKj1zIdyGpkitYoDWw-jDJnPBZcXk-vZi_Bns7AyobGEcQJxqjQdGnijg6YjDcxUgJcY_nRptIfBPw5LkYCtQU7739LsYkv62DbD_zqNaWlJ2FAgi3LUbPlOmV5HILmjeR62YyNqEIT4Dy0YJxIiHQipFAqEObublXLa17u7bE4KJEiP0ykAatvAuDczQSTTGzhWHb6i8pVVY9ghOh5XUINe-1nXLfxOKXh3epGaTANR89_yShR_UjIXTM0';
  };

  return (
    <View style={styles.container}>
      {/* SECTION HEADER & AVERAGE RATING STATS */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.sectionTitle}>Participant Reviews</Text>
          <View style={styles.scoreRow}>
            <Text style={styles.starSymbol}>★</Text>
            <Text style={styles.averageRatingText}>
              {totalCount > 0 ? averageRating.toFixed(1) : 'New'}
            </Text>
            <Text style={styles.reviewCountText}>
              {totalCount > 0 ? `(${totalCount} reviews)` : '(0 reviews)'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.writeButton}
          onPress={onWriteReviewPress}
          activeOpacity={0.8}
        >
          <Text style={styles.writeButtonIcon}>✎</Text>
          <Text style={styles.writeButtonText}>Write Review</Text>
        </TouchableOpacity>
      </View>

      {/* REVIEWS LIST OR EMPTY STATE */}
      {reviews.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyTitle}>No Reviews Yet</Text>
          <Text style={styles.emptySub}>
            Be the first participant to review this competition and share your experience!
          </Text>
        </View>
      ) : (
        <View style={styles.reviewList}>
          {reviews.map((rev) => (
            <View key={rev._id} style={styles.reviewCard}>
              <View style={styles.cardHeader}>
                <Image source={{ uri: getReviewerAvatar(rev.userId) }} style={styles.avatar} />
                <View style={styles.userMeta}>
                  <Text style={styles.userName}>{getReviewerName(rev.userId)}</Text>
                  <Text style={styles.reviewDate}>{formatDate(rev.createdAt)}</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Text style={styles.starMini}>★</Text>
                  <Text style={styles.ratingValue}>{rev.rating}</Text>
                </View>
              </View>
              <Text style={styles.commentText}>{rev.comment}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starSymbol: {
    color: '#FBBF24',
    fontSize: 14,
  },
  averageRatingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  reviewCountText: {
    color: '#9E988D',
    fontSize: 11,
  },
  writeButton: {
    backgroundColor: 'rgba(212, 164, 70, 0.12)',
    borderColor: 'rgba(212, 164, 70, 0.3)',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  writeButtonIcon: {
    color: '#E6C36E',
    fontSize: 12,
  },
  writeButtonText: {
    color: '#E6C36E',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.12)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySub: {
    color: '#9E988D',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  reviewList: {
    gap: 10,
  },
  reviewCard: {
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.15)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(217, 164, 65, 0.3)',
  },
  userMeta: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  reviewDate: {
    color: '#9E988D',
    fontSize: 10,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderColor: 'rgba(251, 191, 36, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
  },
  starMini: {
    color: '#FBBF24',
    fontSize: 10,
  },
  ratingValue: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '700',
  },
  commentText: {
    color: '#D1D5DB',
    fontSize: 12,
    lineHeight: 17,
  },
});
