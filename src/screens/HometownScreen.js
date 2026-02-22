import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useOnboarding } from '../context/OnboardingContext';
import StepIndicator from '../components/StepIndicator';
import BackButton from '../components/BackButton';
import FAB from '../components/FAB';
import VisibilityToggle from '../components/VisibilityToggle';
import COLORS from '../constants/colors';
import { STEP_ORDER } from '../constants/steps';
import sharedStyles from '../styles/shared';

const HometownScreen = ({ onNext, onBack }) => {
    const { dispatch } = useOnboarding();
    const [hometown, setHometown] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const [isFocused, setIsFocused] = useState(false);

    const currentIndex = STEP_ORDER.indexOf('hometown');
    const totalSteps = STEP_ORDER.length;

    const handleNext = () => {
        dispatch({ type: 'SET_FIELD', field: 'hometown', value: hometown });
        dispatch({ type: 'SET_FIELD', field: 'isVisible', key: 'hometown', value: isVisible });
        onNext();
    };

    return (
        <View style={sharedStyles.screenContainer}>
            <View style={sharedStyles.header}>
                <BackButton onPress={onBack} />
                <TouchableOpacity onPress={onNext} style={styles.skipButton}>
                    <Text style={styles.skipButtonText}>SKIP</Text>
                </TouchableOpacity>
            </View>
            <StepIndicator currentIndex={currentIndex} totalSteps={totalSteps} />
            <ScrollView contentContainerStyle={sharedStyles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={sharedStyles.content}>
                    <Text style={sharedStyles.title}>Where your story started</Text>
                    <View style={[styles.underlinedInputContainer, isFocused && { borderBottomColor: COLORS.black }]}>
                        <TextInput style={styles.hometownInput} placeholder="Hometown" placeholderTextColor="#9CA3AF" value={hometown} onChangeText={setHometown} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} selectionColor={COLORS.black} />
                    </View>
                    <VisibilityToggle isVisible={isVisible} onToggle={() => setIsVisible(!isVisible)} activeColor={COLORS.black} style={{ marginTop: 40 }} />
                </View>
            </ScrollView>
            <View style={sharedStyles.footer}>
                <View style={{ flex: 1 }} />
                <FAB onPress={handleNext} disabled={!hometown.trim()} hint="Enter your hometown or skip" />
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
});

export default HometownScreen;
