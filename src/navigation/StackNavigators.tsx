import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StitchHomeScreen from '../screens/StitchHomeScreen';
import AlignChatScreen from '../screens/AlignChatScreen';
import ProfileViewScreen from '../screens/ProfileViewScreen';
import ChatEmptyScreen from '../screens/ChatEmptyScreen';
import { HOME_COLORS } from '../constants/homeColors';

const Stack = createNativeStackNavigator();

const PlaceholderScreen = ({ route }: any) => (
    <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>
            {route.name.replace('Tab', '')} Coming Soon
        </Text>
    </View>
);

const screenOptions = {
    headerShown: false,
    animation: 'fade' as const,
};

export const HomeNavigator = () => (
    <Stack.Navigator id="home-stack" screenOptions={screenOptions}>
        <Stack.Screen name="Home" component={StitchHomeScreen} />
        <Stack.Screen
            name="ProfileDetail"
            component={ProfileViewScreen}
            options={{ presentation: 'modal' }}
        />
        <Stack.Screen
            name="AlignChat"
            component={AlignChatScreen}
        />
        {/* TODO: wire up MatchDetailScreen */}
    </Stack.Navigator>
);

export const MatchmakerNavigator = () => (
    <Stack.Navigator id="matchmaker-stack" screenOptions={screenOptions}>
        <Stack.Screen name="Matchmaker" component={PlaceholderScreen} />
    </Stack.Navigator>
);

export const LikesNavigator = () => (
    <Stack.Navigator id="likes-stack" screenOptions={screenOptions}>
        <Stack.Screen name="Likes" component={PlaceholderScreen} />
    </Stack.Navigator>
);

export const ChatNavigator = () => (
    <Stack.Navigator id="chat-stack" screenOptions={screenOptions}>
        <Stack.Screen name="ChatEmpty" component={ChatEmptyScreen} />
    </Stack.Navigator>
);

export const ProfileNavigator = () => (
    <Stack.Navigator id="profile-stack" screenOptions={screenOptions}>
        <Stack.Screen name="Profile" component={PlaceholderScreen} />
    </Stack.Navigator>
);

const styles = StyleSheet.create({
    placeholderContainer: {
        flex: 1,
        backgroundColor: HOME_COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 18,
        color: HOME_COLORS.text,
    },
});
