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

const WorkplaceScreen = ({ onNext, onBack }) => {
    const { dispatch } = useOnboarding();
    const [workplace, setWorkplace] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const [isFocused, setIsFocused] = useState(false);

    const currentIndex = STEP_ORDER.indexOf('workplace');
    const totalSteps = STEP_ORDER.length;

    const handleNext = () => {
        dispatch({ type: 'SET_FIELD', field: 'workplace', value: workplace });
        dispatch({ type: 'SET_FIELD', field: 'isVisible', key: 'workplace', value: isVisible });
        onNext();
    };

    return (
        <View style={sharedStyles.screenContainer}>
            <View style={sharedStyles.header}>
                <BackButton onPress={onBack} />
                <TouchableOpacity onPress={onNext} style={styles.skipButton}>
                    <Text style={sharedStyles.skipButtonText || { color: '#9CA3AF', fontFamily: 'Inter_600SemiBold', fontSize: 13, letterSpacing: 1.5 }}>SKIP</Text>
                </TouchableOpacity>
            </View>
            <StepIndicator currentIndex={currentIndex} totalSteps={totalSteps} />
            <ScrollView contentContainerStyle={sharedStyles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={sharedStyles.content}>
                    <Text style={sharedStyles.title}>Where you build your career</Text>
                    <View style={[styles.underlinedInputContainer, isFocused && { borderBottomColor: COLORS.black }]}>
                        <TextInput style={styles.hometownInput} placeholder="Workplace" placeholderTextColor="#9CA3AF" value={workplace} onChangeText={setWorkplace} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} selectionColor={COLORS.black} />
                    </View>
                    <VisibilityToggle isVisible={isVisible} onToggle={() => setIsVisible(!isVisible)} activeColor={COLORS.black} style={{ marginTop: 40 }} />
                </View>
            </ScrollView>
            <View style={sharedStyles.footer}>
                <View style={{ flex: 1 }} />
                <FAB onPress={handleNext} disabled={!workplace.trim()} hint="Enter your workplace or skip" />
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

export default WorkplaceScreen;
