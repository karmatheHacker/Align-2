import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useOnboarding } from '../context/OnboardingContext';
import StepIndicator from '../components/StepIndicator';
import FAB from '../components/FAB';
import VisibilityToggle from '../components/VisibilityToggle';
import VisibilityInfoSheet from '../components/VisibilityInfoSheet';
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import { STEP_ORDER } from '../constants/steps';
import sharedStyles from '../styles/shared';
import PremiumScreenWrapper from '../components/PremiumScreenWrapper';

const SchoolScreen = ({ onNext, onBack }) => {
    const { dispatch } = useOnboarding();
    const [school, setSchool] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    // M-5: Added missing infoSheet state
    const [infoSheetOpen, setInfoSheetOpen] = useState(false);

    const currentIndex = STEP_ORDER.indexOf('school');
    const totalSteps = STEP_ORDER.length;

    const handleNext = () => {
        dispatch({ type: 'SET_FIELD', field: 'school', value: school });
        dispatch({ type: 'SET_FIELD', field: 'isVisible', key: 'school', value: isVisible });
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

                        {/* M-5: Added onInfoPress and VisibilityInfoSheet */}
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
                                fieldName="school"
                                isVisible={isVisible}
                                onClose={() => setInfoSheetOpen(false)}
                            />
                        )}

                        <Text style={styles.hintText}>
                            Align members use this to find common ground. You can change who sees this later in your settings.
                        </Text>
                    </View>
                </PremiumScreenWrapper>
            </ScrollView>

            <View style={sharedStyles.footer}>
                <View style={{ flex: 1 }} />
                <FAB onPress={handleNext} disabled={!school.trim()} hint="Enter your school or skip" />
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
    hintText: {
        fontFamily: 'Inter_400Regular',
        fontSize: 14,
        color: '#8E8E93',
        lineHeight: 20,
        marginTop: SPACING.md, // m-6: was marginTop: 15 (off-grid), now SPACING.md = 16
    },
});

export default SchoolScreen;
