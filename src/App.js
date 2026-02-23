import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { OnboardingStack, MainStack } from './navigation/AppNavigator';
import { OnboardingProvider } from './context/OnboardingContext';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import SkeletonLoader from './components/SkeletonLoader';
import COLORS from './constants/colors';

const App = () => {
    const [onboardingComplete, setOnboardingComplete] = useState(false);

    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        PlayfairDisplay_700Bold,
        BebasNeue_400Regular,
    });

    if (!fontsLoaded) {
        return (
            <SafeAreaProvider>
                <SkeletonLoader key="skeleton" />
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <OnboardingProvider>
                <NavigationContainer>
                    <StatusBar barStyle="dark-content" />
                    {onboardingComplete ? (
                        <MainStack />
                    ) : (
                        <View style={{ flex: 1, backgroundColor: COLORS.surface }}>
                            <OnboardingStack onComplete={() => setOnboardingComplete(true)} />
                        </View>
                    )}
                </NavigationContainer>
            </OnboardingProvider>
        </SafeAreaProvider>
    );
};

export default App;
