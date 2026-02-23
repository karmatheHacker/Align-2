import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useOnboarding } from '../context/OnboardingContext';
import StepIndicator from '../components/StepIndicator';
import FAB from '../components/FAB';
import OptionRow from '../components/OptionRow';
import VisibilityToggle from '../components/VisibilityToggle';
import VisibilityInfoSheet from '../components/VisibilityInfoSheet';
import PremiumScreenWrapper from '../components/PremiumScreenWrapper';
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import { STEP_ORDER } from '../constants/steps';
import sharedStyles from '../styles/shared';

const TobaccoScreen = ({ onNext, onBack }) => {
    const { dispatch } = useOnboarding();
    const [selectedTobacco, setSelectedTobacco] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    // M-2: Added missing infoSheet state
    const [infoSheetOpen, setInfoSheetOpen] = useState(false);

    const currentIndex = STEP_ORDER.indexOf('tobacco');
    const totalSteps = STEP_ORDER.length;

    const handleNext = () => {
        dispatch({ type: 'SET_FIELD', field: 'tobacco', value: selectedTobacco });
        dispatch({ type: 'SET_FIELD', field: 'isVisible', key: 'tobacco', value: isVisible });
        onNext();
    };

    const options = [
        { id: 'Yes', label: 'Yes' },
        { id: 'Sometimes', label: 'Sometimes' },
        { id: 'No', label: 'No' },
        { id: 'pnts', label: 'Prefer not to say' },
    ];

    return (
        <View style={sharedStyles.screenContainer}>
            <StepIndicator currentIndex={currentIndex} totalSteps={totalSteps} onBack={onBack} />

            <ScrollView contentContainerStyle={sharedStyles.scrollContent} showsVerticalScrollIndicator={false}>
                <PremiumScreenWrapper>
                    <View style={sharedStyles.content}>
                        <Text style={sharedStyles.title}>
                            Your relationship with tobacco
                        </Text>

                        <View style={sharedStyles.intentionList}>
                            {options.map((option) => (
                                <OptionRow
                                    key={option.id}
                                    label={option.label}
                                    selected={selectedTobacco === option.id}
                                    onPress={() => setSelectedTobacco(option.id)}
                                    activeColor={COLORS.black}
                                    style={[sharedStyles.intentionOption, { paddingVertical: SPACING.lg }]}
                                />
                            ))}
                        </View>
                        <View style={sharedStyles.visibilityToggleRowStandalone}>
                            {/* M-2: Added onInfoPress so info sheet icon is visible */}
                            <VisibilityToggle
                                isVisible={isVisible}
                                onToggle={() => setIsVisible(!isVisible)}
                                onInfoPress={() => setInfoSheetOpen(true)}
                                activeColor={COLORS.black}
                            />
                        </View>
                        {/* M-2: Added VisibilityInfoSheet */}
                        {infoSheetOpen && (
                            <VisibilityInfoSheet
                                fieldName="tobacco"
                                isVisible={isVisible}
                                onClose={() => setInfoSheetOpen(false)}
                            />
                        )}
                    </View>
                </PremiumScreenWrapper>
            </ScrollView>

            {/* m-1: Fixed </View > trailing space */}
            <View style={sharedStyles.footer}>
                <View style={{ flex: 1 }} />
                <FAB onPress={handleNext} disabled={!selectedTobacco} hint="Select your status to continue" />
            </View>
        </View>
    );
};

// C-4 equivalent: dead styles removed
const styles = StyleSheet.create({});

export default TobaccoScreen;
