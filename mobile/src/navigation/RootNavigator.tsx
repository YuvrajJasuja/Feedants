import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider, useAuth } from '../context/AuthContext';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import CompetitionDetailsScreen from '../screens/CompetitionDetailsScreen';
import MyCompetitionsScreen from '../screens/MyCompetitionsScreen';
import UploadSubmissionScreen from '../screens/UploadSubmissionScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AuthScreen from '../screens/AuthScreen';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DummyCreateScreen = () => <View style={{ flex: 1, backgroundColor: '#080B0D' }} />;

function TabNavigator() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 6);
  const tabHeight = 56 + bottomPadding;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0A0E11',
          borderTopColor: 'rgba(217, 164, 65, 0.2)',
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: bottomPadding,
          paddingTop: 6,
        },
        tabBarActiveTintColor: '#D4A446',
        tabBarInactiveTintColor: '#706C64',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.2,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.6 }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.6 }}>🔍</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={DummyCreateScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('UploadSubmission');
          },
        })}
        options={{
          tabBarLabel: 'Create',
          tabBarIcon: () => (
            <View style={styles.createTabBadge}>
              <Text style={{ color: '#080B0D', fontSize: 16, fontWeight: '800' }}>＋</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="MyCompetitions"
        component={MyCompetitionsScreen}
        options={{
          tabBarLabel: 'Competitions',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.6 }}>🏆</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.6 }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function NavigationStack() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4A446" />
        <Text style={styles.loadingText}>Restoring session...</Text>
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="CompetitionDetails" component={CompetitionDetailsScreen} />
        <Stack.Screen name="UploadSubmission" component={UploadSubmissionScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export function RootNavigator() {
  return (
    <AuthProvider>
      <NavigationStack />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#080B0D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#9E988D',
    fontSize: 13,
    marginTop: 12,
  },
  createTabBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#D4A446',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    shadowColor: '#D4A446',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default RootNavigator;
