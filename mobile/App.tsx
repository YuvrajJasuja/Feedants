import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { getEnvConfig } from './src/config/env';

// Validate environment variables at application startup
const env = getEnvConfig();
console.log(`[App Starting] Mode: ${env.environment}, API Endpoint: ${env.apiUrl}`);

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}

