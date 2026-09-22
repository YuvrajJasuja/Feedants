import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface SelectedMediaInfo {
  uri: string;
  name?: string;
  fileSize?: number;
  type?: string;
  duration?: number | null;
}

interface Props {
  onMediaSelect: (media: SelectedMediaInfo) => void;
}

// Production implementation should upload media to object storage such as S3/Cloudinary and persist the resulting URL.
export const MediaPicker: React.FC<Props> = ({ onMediaSelect }) => {

  const pickVideo = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Required',
          'Media access is required to select your submission video. Please grant permission in your device settings.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        // Validate max file size (500 MB)
        if (asset.fileSize && asset.fileSize > 500 * 1024 * 1024) {
          Alert.alert('File Too Large', 'The selected video exceeds the 500MB size limit.');
          return;
        }

        const fileName = asset.fileName || `performance_video_${Date.now()}.mp4`;

        onMediaSelect({
          uri: asset.uri,
          name: fileName,
          fileSize: asset.fileSize || 15728640, // default 15MB representation
          type: asset.type || 'video',
          duration: asset.duration,
        });
      }
    } catch (err: any) {
      Alert.alert('Selection Error', err?.message || 'Unable to select video file.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload your submission</Text>
      <Text style={styles.subtitle}>Show us your talent.</Text>

      <TouchableOpacity style={styles.uploadArea} onPress={pickVideo} activeOpacity={0.85}>
        <View style={styles.iconCircle}>
          <Text style={{ fontSize: 32 }}>🎬</Text>
        </View>
        <Text style={styles.btnLabel}>Choose Video</Text>
        <Text style={styles.hint}>Supports MP4, MOV (Max 500MB, 1080p classical performance)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#9E988D',
    fontSize: 13,
    marginBottom: 16,
  },
  uploadArea: {
    backgroundColor: '#12161A',
    borderColor: 'rgba(217, 164, 65, 0.3)',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(212, 164, 70, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  btnLabel: {
    color: '#E6C36E',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  hint: {
    color: '#706C64',
    fontSize: 11,
    textAlign: 'center',
  },
});

export default MediaPicker;
