import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useOnboarding } from '../context/OnboardingContext';
import StepIndicator from '../components/StepIndicator';
import BackButton from '../components/BackButton';
import FAB from '../components/FAB';
import VisibilityToggle from '../components/VisibilityToggle';
import VisibilityInfoSheet from '../components/VisibilityInfoSheet';
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import { STEP_ORDER } from '../constants/steps';
import sharedStyles from '../styles/shared';
import PremiumScreenWrapper from '../components/PremiumScreenWrapper';

const HometownScreen = ({ onNext, onBack }) => {
    const { dispatch } = useOnboarding();
    const [hometown, setHometown] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const [infoSheetOpen, setInfoSheetOpen] = useState(false);

    const currentIndex = STEP_ORDER.indexOf('hometown');
    const totalSteps = STEP_ORDER.length;

    const handleNext = () => {
        dispatch({ type: 'SET_FIELD', field: 'hometown', value: hometown });
        dispatch({ type: 'SET_FIELD', field: 'isVisible', key: 'hometown', value: isVisible });
        onNext();
    };

    return (
        <View style={sharedStyles.screenContainer}>
            <StepIndicator
                currentIndex={currentIndex}
                totalSteps={totalSteps}
                onBack={onBack}
                rightAction={
                    <TouchableOpacity onPress={onNext}>
                        <Text style={sharedStyles.skipButtonText}>SKIP</Text>
                    </TouchableOpacity>
                }
            />
            <ScrollView contentContainerStyle={sharedStyles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <PremiumScreenWrapper animateEntrance>
                    <View style={sharedStyles.content}>
                        <Text style={sharedStyles.title}>Where your story started</Text>
                        <View style={[styles.underlinedInputContainer, isFocused && { borderBottomColor: COLORS.black }]}>
                            <TextInput style={styles.hometownInput} placeholder="Hometown" placeholderTextColor="#9CA3AF" value={hometown} onChangeText={setHometown} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} selectionColor={COLORS.black} />
                        </View>
                        <View style={sharedStyles.visibilityToggleRowStandalone}>
                            <VisibilityToggle
                                isVisible={isVisible}
                                onToggle={() => setIsVisible(!isVisible)}
                                onInfoPress={() => setInfoSheetOpen(true)}
                                activeColor={COLORS.black}
                            />
                        </View>
                        {infoSheetOpen && (
                            <VisibilityInfoSheet
                                fieldName="hometown"
                                isVisible={isVisible}
                                onClose={() => setInfoSheetOpen(false)}
                            />
                        )}
                    </View>
                </PremiumScreenWrapper>
            </ScrollView>
            <View style={sharedStyles.footer}>
                <View style={{ flex: 1 }} />
                <FAB onPress={handleNext} disabled={!hometown.trim()} hint="Enter your hometown or skip" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    underlinedInputContainer: {
        borderBottomWidth: 2,
        borderBottomColor: COLORS.black,
        marginBottom: SPACING.lg,
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
