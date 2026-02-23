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

const SexualityScreen = ({ onNext, onBack }) => {
    const { dispatch } = useOnboarding();
    const [selectedSexuality, setSelectedSexuality] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const [infoSheetOpen, setInfoSheetOpen] = useState(false);

    const currentIndex = STEP_ORDER.indexOf('sexuality');
    const totalSteps = STEP_ORDER.length;

    const handleNext = () => {
        dispatch({ type: 'SET_FIELD', field: 'sexuality', value: selectedSexuality });
        dispatch({ type: 'SET_FIELD', field: 'isVisible', key: 'sexuality', value: isVisible });
        onNext();
    };

    const options = [
        { id: 'straight', label: 'Straight' },
        { id: 'gay', label: 'Gay' },
        { id: 'lesbian', label: 'Lesbian' },
        { id: 'bisexual', label: 'Bisexual' },
        { id: 'pansexual', label: 'Pansexual' },
        { id: 'queer', label: 'Queer' },
        { id: 'asexual', label: 'Asexual' },
        { id: 'demisexual', label: 'Demisexual' },
        { id: 'sapiosexual', label: 'Sapiosexual' },
        { id: 'heteroflexible', label: 'Heteroflexible' },
        { id: 'homoflexible', label: 'Homoflexible' },
        { id: 'polysexual', label: 'Polysexual' },
        { id: 'bicurious', label: 'Bicurious' },
        { id: 'questioning', label: 'Questioning' },
        { id: 'allosexual', label: 'Allosexual' },
        { id: 'androsexual', label: 'Androsexual' },
    ];

    return (
        <View style={sharedStyles.screenContainer}>
            <StepIndicator currentIndex={currentIndex} totalSteps={totalSteps} onBack={onBack} />
            <ScrollView contentContainerStyle={sharedStyles.scrollContent} showsVerticalScrollIndicator={false}>
                <PremiumScreenWrapper>
                    <View style={sharedStyles.content}>
                        <Text style={sharedStyles.title}>Who you are drawn to</Text>
                        <View style={styles.sexualityList}>
                            {options.map((option) => (
                                <OptionRow
                                    key={option.id}
                                    label={option.label}
                                    selected={selectedSexuality === option.id}
                                    onPress={() => setSelectedSexuality(option.id)}
                                    variant="radio"
                                    activeColor={COLORS.black}
                                    style={[
                                        styles.sexualityCard,
                                        selectedSexuality === option.id && styles.sexualityCardSelected
                                    ]}
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
                                fieldName="sexuality"
                                isVisible={isVisible}
                                onClose={() => setInfoSheetOpen(false)}
                            />
                        )}
                    </View>
                </PremiumScreenWrapper>
            </ScrollView>
            <View style={sharedStyles.footer}>
                <View style={{ flex: 1 }} />
                <FAB
                    onPress={handleNext}
                    disabled={!selectedSexuality}
                    hint="Select your orientation to continue"
                />
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    sexualityList: {
        marginTop: SPACING.sm, // M-9: was 10 (off-grid)
        gap: 12,
        paddingBottom: SPACING.lg, // M-9: was 20 (off-grid), SPACING.lg = 24
    },
    sexualityCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    sexualityCardSelected: {
        borderColor: COLORS.black,
        backgroundColor: COLORS.white, // M-9: was '#FFFFFF' raw hex
    },
});

export default SexualityScreen;
