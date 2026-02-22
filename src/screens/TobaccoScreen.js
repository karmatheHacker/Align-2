import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useOnboarding } from '../context/OnboardingContext';
import StepIndicator from '../components/StepIndicator';
import BackButton from '../components/BackButton';
import FAB from '../components/FAB';
import OptionRow from '../components/OptionRow';
import VisibilityToggle from '../components/VisibilityToggle';
import PremiumScreenWrapper from '../components/PremiumScreenWrapper';
import COLORS from '../constants/colors';
import { STEP_ORDER } from '../constants/steps';
import sharedStyles from '../styles/shared';

const TobaccoScreen = ({ onNext, onBack }) => {
    const { dispatch } = useOnboarding();
    const [selectedTobacco, setSelectedTobacco] = useState(null);
    const [isVisible, setIsVisible] = useState(true);

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
            <View style={sharedStyles.header}>
                <BackButton onPress={onBack} />
            </View>
            <StepIndicator currentIndex={currentIndex} totalSteps={totalSteps} />

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
                                    style={[sharedStyles.intentionOption, { paddingVertical: 20 }]}
                                />
                            ))}
                        </View>

                        <VisibilityToggle
                            isVisible={isVisible}
                            onToggle={() => setIsVisible(!isVisible)}
                            activeColor={COLORS.black}
                            style={[styles.visibilityToggleCard, { marginTop: 48 }]}
                        />
                    </View>
                </PremiumScreenWrapper>
            </ScrollView>

            <View style={[styles.p8, { alignItems: 'center' }]}>
                <Text style={styles.brandingText}>{`Align © ${new Date().getFullYear()}`}</Text>
            </View>

            <View style={sharedStyles.footer}>
                <View style={{ flex: 1 }} />
                <FAB onPress={handleNext} disabled={!selectedTobacco} hint="Select your status to continue" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    visibilityToggleCard: {
        padding: 20,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
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

export default TobaccoScreen;
