import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
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

const SexualityScreen = ({ onNext, onBack }) => {
    const { dispatch } = useOnboarding();
    const [selectedSexuality, setSelectedSexuality] = useState(null);
    const [isVisible, setIsVisible] = useState(true);

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
        { id: 'allosexual', label: 'Allosexual' },
        { id: 'androsexual', label: 'Androsexual' },
        { id: 'asexual', label: 'Asexual' },
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
                        <Text style={sharedStyles.title}>Who you are drawn to</Text>
                        <View style={styles.sexualityList}>
                            {options.map((option) => (
                                <OptionRow
                                    key={option.id}
                                    label={option.label}
                                    selected={selectedSexuality === option.id}
                                    onPress={() => setSelectedSexuality(option.id)}
                                    activeColor={COLORS.black}
                                    variant="radio"
                                    style={[
                                        styles.sexualityCard,
                                        selectedSexuality === option.id && styles.sexualityCardSelected
                                    ]}
                                    labelStyle={selectedSexuality === option.id && styles.sexualityLabelSelected}
                                />
                            ))}
                        </View>
                    </View>
                </PremiumScreenWrapper>
            </ScrollView>
            <View style={sharedStyles.footer}>
                <VisibilityToggle
                    isVisible={isVisible}
                    onToggle={() => setIsVisible(!isVisible)}
                    activeColor={COLORS.black}
                    style={{ flex: 1, paddingRight: 20 }}
                />
                <FAB
                    onPress={handleNext}
                    disabled={!selectedSexuality}
                    hint="Select your orientation to continue"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sexualityList: {
        marginTop: 10,
        gap: 12,
        paddingBottom: 20,
    },
    sexualityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#F3F4F6',
        backgroundColor: COLORS.white,
        marginHorizontal: -20,
    },
    sexualityCardSelected: {
        borderColor: COLORS.black,
        backgroundColor: '#F9FAFB',
    },
    sexualityLabelSelected: {
        color: COLORS.black,
        fontFamily: 'Inter_600SemiBold',
    },
});

export default SexualityScreen;
