import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
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

const ChildrenScreen = ({ onNext, onBack }) => {
    const { dispatch } = useOnboarding();
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const [infoSheetOpen, setInfoSheetOpen] = useState(false);

    const currentIndex = STEP_ORDER.indexOf('children');
    const totalSteps = STEP_ORDER.length;

    const handleNext = () => {
        dispatch({ type: 'SET_FIELD', field: 'children', value: selectedStatus });
        dispatch({ type: 'SET_FIELD', field: 'isVisible', key: 'children', value: isVisible });
        onNext();
    };

    const options = [
        { id: 'none', label: "Don't have children" },
        { id: 'have', label: 'Have children' },
        { id: 'prefer_not', label: 'Prefer not to say', description: "This will limit who sees your profile." },
    ];

    return (
        <View style={sharedStyles.screenContainer}>
            <StepIndicator currentIndex={currentIndex} totalSteps={totalSteps} onBack={onBack} />
            <ScrollView contentContainerStyle={sharedStyles.scrollContent} showsVerticalScrollIndicator={false}>
                <PremiumScreenWrapper>
                    <View style={sharedStyles.content}>
                        <Text style={sharedStyles.title}>The family in your life</Text>
                        <View style={sharedStyles.intentionList}>
                            {options.map((option) => (
                                <OptionRow key={option.id} label={option.label} description={option.description} selected={selectedStatus === option.id} onPress={() => setSelectedStatus(option.id)} activeColor={COLORS.black} style={sharedStyles.intentionOption} />
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
                                fieldName="children"
                                isVisible={isVisible}
                                onClose={() => setInfoSheetOpen(false)}
                            />
                        )}
                    </View>
                </PremiumScreenWrapper>
            </ScrollView>
            <View style={sharedStyles.footer}>
                <View style={{ flex: 1 }} />
                <FAB onPress={handleNext} disabled={!selectedStatus} hint="Select your status to continue" />
            </View>
        </View>
    );
};

export default ChildrenScreen;
