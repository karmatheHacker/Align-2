import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useOnboarding } from '../context/OnboardingContext';
import StepIndicator from '../components/StepIndicator';
import BackButton from '../components/BackButton';
import FAB from '../components/FAB';
import OptionRow from '../components/OptionRow';
import VisibilityToggle from '../components/VisibilityToggle';
import VisibilityInfoSheet from '../components/VisibilityInfoSheet';
import PremiumScreenWrapper from '../components/PremiumScreenWrapper';
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import { STEP_ORDER } from '../constants/steps';
import sharedStyles from '../styles/shared';

const EducationScreen = ({ onNext, onBack }) => {
    const { dispatch } = useOnboarding();
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const [infoSheetOpen, setInfoSheetOpen] = useState(false);

    const currentIndex = STEP_ORDER.indexOf('education');
    const totalSteps = STEP_ORDER.length;

    const handleNext = () => {
        dispatch({ type: 'SET_FIELD', field: 'education', value: selectedLevel });
        dispatch({ type: 'SET_FIELD', field: 'isVisible', key: 'education', value: isVisible });
        onNext();
    };

    const levels = [
        { id: 'High School', label: 'High School' },
        { id: 'Undergrad', label: 'Undergrad' },
        { id: 'Postgrad', label: 'Postgrad' },
        { id: 'private', label: 'Prefer not to say', description: 'This will limit who sees your profile.' },
    ];

    return (
        <View style={sharedStyles.screenContainer}>
            <StepIndicator currentIndex={currentIndex} totalSteps={totalSteps} onBack={onBack} />

            <ScrollView contentContainerStyle={sharedStyles.scrollContent} showsVerticalScrollIndicator={false}>
                <PremiumScreenWrapper>
                    <View style={sharedStyles.content}>
                        <Text style={sharedStyles.title}>Your educational foundation</Text>
                        <View style={sharedStyles.intentionList}>
                            {levels.map((level) => (
                                <OptionRow
                                    key={level.id}
                                    label={level.label}
                                    description={level.description}
                                    selected={selectedLevel === level.id}
                                    onPress={() => setSelectedLevel(level.id)}
                                    activeColor={COLORS.black}
                                    variant="radio"
                                    style={sharedStyles.intentionOption}
                                />
                            ))}
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
                                fieldName="education"
                                isVisible={isVisible}
                                onClose={() => setInfoSheetOpen(false)}
                            />
                        )}
                    </View>
                </PremiumScreenWrapper>
            </ScrollView>

            <View style={sharedStyles.footer}>
                <View style={{ flex: 1 }} />
                <FAB onPress={handleNext} disabled={!selectedLevel} hint="Select your education level to continue" />
            </View>
        </View>
    );
};

export default EducationScreen;
