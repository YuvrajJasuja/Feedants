import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import CompetitionDetailsScreen from '../screens/CompetitionDetailsScreen';
import MyCompetitionsScreen from '../screens/MyCompetitionsScreen';
import UploadSubmissionScreen from '../screens/UploadSubmissionScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="CompetitionDetails"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0A0E11',
          borderTopColor: 'rgba(255, 255, 255, 0.08)',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: '#E6C36E',
        tabBarInactiveTintColor: '#9E988D',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 16 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 16 }}>🔍</Text>,
        }}
      />
      <Tab.Screen
        name="CompetitionDetails"
        component={CompetitionDetailsScreen}
        options={{
          tabBarLabel: 'Competitions',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 16 }}>🏆</Text>,
        }}
      />
      <Tab.Screen
        name="MyCompetitions"
        component={MyCompetitionsScreen}
        options={{
          tabBarLabel: 'My Contests',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 16 }}>🎗️</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 16 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="UploadSubmission" component={UploadSubmissionScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
