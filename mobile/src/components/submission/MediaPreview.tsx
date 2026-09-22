import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

interface Props {
  uri: string;
  fileName?: string;
  fileSize?: number;
  type?: string;
  duration?: number | null;
  onChangeMedia: () => void;
  onRemoveMedia: () => void;
}

export const MediaPreview: React.FC<Props> = ({
  uri,
  fileName,
  fileSize,
  type,
  duration,
  onChangeMedia,
  onRemoveMedia,
}) => {
  const formatSize = (bytes?: number) => {
    if (!bytes) return '15 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDuration = (seconds?: number | null) => {
    if (!seconds) return '02:30';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.previewBox}>
        <View style={styles.videoBadge}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
        <View style={styles.infoCol}>
          <View style={styles.selectedRow}>
            <Text style={styles.selectedTag}>SELECTED</Text>
            <Text style={styles.durationText}>{formatDuration(duration)}</Text>
          </View>
          <Text style={styles.fileName} numberOfLines={1}>
            {fileName || 'classical_kathak_performance.mp4'}
          </Text>
          <Text style={styles.metaText}>
            Type: {type || 'video/mp4'} | Size: {formatSize(fileSize)}
          </Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.changeBtn} onPress={onChangeMedia} activeOpacity={0.8}>
          <Text style={styles.changeText}>🔄 Change Video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.removeBtn} onPress={onRemoveMedia} activeOpacity={0.8}>
          <Text style={styles.removeText}>🗑️ Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.3)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
  },
  previewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  videoBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(212, 164, 70, 0.2)',
    borderColor: '#D4A446',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  playIcon: {
    color: '#D4A446',
    fontSize: 16,
  },
  infoCol: {
    flex: 1,
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  selectedTag: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  durationText: {
    color: '#9E988D',
    fontSize: 11,
    fontWeight: '600',
  },
  fileName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  metaText: {
    color: '#706C64',
    fontSize: 11,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 12,
  },
  changeBtn: {
    flex: 1,
    backgroundColor: 'rgba(212, 164, 70, 0.15)',
    borderColor: '#D4A446',
    borderWidth: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  changeText: {
    color: '#E6C36E',
    fontSize: 12,
    fontWeight: '700',
  },
  removeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  removeText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default MediaPreview;
