import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, Image } from 'react-native';

export const ProfileScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={{
            uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvuG3miwQBhKj1zIdyGpkitYoDWw-jDJnPBZcXk-vZi_Bns7AyobGEcQJxqjQdGnijg6YjDcxUgJcY_nRptIfBPw5LkYCtQU7739LsYkv62DbD_zqNaWlJ2FAgi3LUbPlOmV5HILmjeR62YyNqEIT4Dy0YJxIiHQipFAqEObublXLa17u7bE4KJEiP0ykAatvAuDczQSTTGzhWHb6i8pVVY9ghOh5XUINe-1nXLfxOKXh3epGaTANR89_yShR_UjIXTM0',
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Feedants Artist</Text>
        <Text style={styles.email}>artist@feedants.com</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080B0D',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#D4A446',
    marginBottom: 12,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    color: '#9E988D',
    fontSize: 13,
  },
});

export default ProfileScreen;
