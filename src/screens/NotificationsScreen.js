import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useOnboarding } from '../context/OnboardingContext';
import StepIndicator from '../components/StepIndicator';
import BackButton from '../components/BackButton';
import FAB from '../components/FAB';
import COLORS from '../constants/colors';
import { STEP_ORDER } from '../constants/steps';
import sharedStyles from '../styles/shared';
import PremiumScreenWrapper from '../components/PremiumScreenWrapper';

const NotificationsScreen = ({ onNext, onBack }) => {
    const { dispatch } = useOnboarding();
    const [notifChoice, setNotifChoice] = useState(null);

    const currentIndex = STEP_ORDER.indexOf('notifications');
    const totalSteps = STEP_ORDER.length;

    const handleNext = () => {
        dispatch({ type: 'SET_FIELD', field: 'notifications', value: notifChoice });
        onNext();
    };

    return (
        <View style={sharedStyles.screenContainer}>
            <ScrollView contentContainerStyle={sharedStyles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <View style={sharedStyles.header}>
                    <BackButton onPress={onBack} />
                </View>
                <StepIndicator currentIndex={currentIndex} totalSteps={totalSteps} />
                <PremiumScreenWrapper animateEntrance>
                    <View style={sharedStyles.content}>
                        <Text style={sharedStyles.title}>Never miss a message from someone great</Text>
                        <Text style={sharedStyles.bodyText}>
                            Turn on notifications to know instantly when you get a new match or message.
                        </Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[sharedStyles.pillButton, notifChoice === 'enabled' && styles.pillButtonActive]}
                                activeOpacity={0.8}
                                onPress={() => { setNotifChoice('enabled'); }}
                                accessibilityRole="button"
                            >
                                <Feather name={notifChoice === 'enabled' ? 'check-circle' : 'bell'} size={18} color={COLORS.white} />
                                <Text style={sharedStyles.pillButtonText}>
                                    {notifChoice === 'enabled' ? 'Notifications enabled ✓' : 'Enable notifications'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.pillButtonSecondary, notifChoice === 'disabled' && styles.pillButtonSecondaryActive]}
                                activeOpacity={0.8}
                                onPress={() => { setNotifChoice('disabled'); }}
                                accessibilityRole="button"
                            >
                                <Feather name={notifChoice === 'disabled' ? 'check-circle' : 'bell-off'} size={18} color={COLORS.text} />
                                <Text style={styles.pillButtonTextSecondary}>
                                    {notifChoice === 'disabled' ? 'Notifications off ✓' : 'Disable notifications'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </PremiumScreenWrapper>
            </ScrollView>
            <View style={sharedStyles.footer}>
                <View style={{ flex: 1 }} />
                <FAB
                    onPress={handleNext}
                    disabled={!notifChoice}
                    hint="Choose a notification preference"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        gap: 16,
        marginTop: 20,
    },
    pillButtonActive: {
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    pillButtonSecondary: {
        backgroundColor: COLORS.white,
        borderRadius: 30,
        height: 58,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
    },
    pillButtonSecondaryActive: {
        borderColor: COLORS.text,
        borderWidth: 2,
    },
    pillButtonTextSecondary: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
        color: COLORS.text,
    },
});

export default NotificationsScreen;
