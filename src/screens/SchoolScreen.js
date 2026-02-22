import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useOnboarding } from '../context/OnboardingContext';
import StepIndicator from '../components/StepIndicator';
import BackButton from '../components/BackButton';
import FAB from '../components/FAB';
import VisibilityToggle from '../components/VisibilityToggle';
import COLORS from '../constants/colors';
import { STEP_ORDER } from '../constants/steps';
import sharedStyles from '../styles/shared';

const SchoolScreen = ({ onNext, onBack }) => {
    const { dispatch } = useOnboarding();
    const [school, setSchool] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const [isFocused, setIsFocused] = useState(false);

    const currentIndex = STEP_ORDER.indexOf('school');
    const totalSteps = STEP_ORDER.length;

    const handleNext = () => {
        dispatch({ type: 'SET_FIELD', field: 'school', value: school });
        dispatch({ type: 'SET_FIELD', field: 'isVisible', key: 'school', value: isVisible });
        onNext();
    };

    return (
        <View style={sharedStyles.screenContainer}>
            <View style={sharedStyles.header}>
                <BackButton onPress={onBack} />
                <TouchableOpacity style={styles.skipButton} onPress={onNext}>
                    <Text style={styles.skipButtonText}>SKIP</Text>
                </TouchableOpacity>
            </View>

            <StepIndicator currentIndex={currentIndex} totalSteps={totalSteps} />

            <ScrollView contentContainerStyle={sharedStyles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <View style={sharedStyles.content}>
                    <Text style={sharedStyles.title}>The places that shaped you</Text>

                    <View style={[
                        styles.underlinedInputContainer,
                        isFocused && { borderBottomColor: COLORS.black }
                    ]}>
                        <TextInput
                            style={styles.hometownInput}
                            placeholder="Add a school"
                            placeholderTextColor="#9CA3AF"
                            value={school}
                            onChangeText={setSchool}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            selectionColor={COLORS.black}
                        />
                    </View>

                    <View style={styles.visibilitySeparator} />
                    <VisibilityToggle
                        isVisible={isVisible}
                        onToggle={() => setIsVisible(!isVisible)}
                        activeColor={COLORS.black}
                        style={{ marginTop: 20 }}
                    />

                    <Text style={styles.hintText}>
                        Align members use this to find common ground. You can change who sees this later in your settings.
                    </Text>
                </View>
            </ScrollView>

            <View style={[styles.p8, { alignItems: 'center' }]}>
                <Text style={styles.brandingText}>Align © 2024</Text>
            </View>

            <View style={sharedStyles.footer}>
                <View style={{ flex: 1 }} />
                <FAB onPress={handleNext} disabled={!school.trim()} hint="Enter your school or skip" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    skipButton: {
        position: 'absolute',
        top: 20,
        right: 0,
        padding: 5,
    },
    skipButtonText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 13,
        color: '#9CA3AF',
        letterSpacing: 1.5,
    },
    underlinedInputContainer: {
        borderBottomWidth: 2,
        borderBottomColor: COLORS.black,
        marginBottom: 24,
    },
    hometownInput: {
        fontFamily: 'Inter_400Regular',
        fontSize: 24,
        color: COLORS.text,
        paddingVertical: 12,
        paddingHorizontal: 0,
    },
    visibilitySeparator: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        marginTop: 20,
    },
    hintText: {
        fontFamily: 'Inter_400Regular',
        fontSize: 14,
        color: '#8E8E93',
        lineHeight: 20,
        marginTop: 15,
    },
    p8: {
        padding: 32,
    },
    brandingText: {
        fontSize: 10,
        fontFamily: 'Inter_700Bold',
        color: '#D1D5DB',
        letterSpacing: 2,
        textAlign: 'center',
    },
});

export default SchoolScreen;
