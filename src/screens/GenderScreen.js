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

const GenderScreen = ({ onNext, onBack }) => {
    const { dispatch } = useOnboarding();
    const [selectedGender, setSelectedGender] = useState(null);
    const [isVisible, setIsVisible] = useState(true);

    const currentIndex = STEP_ORDER.indexOf('gender');
    const totalSteps = STEP_ORDER.length;

    const handleNext = () => {
        dispatch({ type: 'SET_FIELD', field: 'gender', value: selectedGender });
        dispatch({ type: 'SET_FIELD', field: 'isVisible', key: 'gender', value: isVisible });
        onNext();
    };

    const options = [
        { id: 'man', label: 'Man' },
        { id: 'woman', label: 'Woman' },
        { id: 'nonbinary', label: 'Nonbinary' },
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
                        <Text style={sharedStyles.title}>The gender that describes you</Text>
                        <Text style={sharedStyles.bodyText}>
                            We match daters using 3 broad gender groups. You can add more about your gender after.
                        </Text>
                        <View style={styles.genderList}>
                            {options.map((option, index) => (
                                <OptionRow
                                    key={option.id}
                                    label={option.label}
                                    selected={selectedGender === option.id}
                                    onPress={() => setSelectedGender(option.id)}
                                    variant="radio"
                                    activeColor={COLORS.black}
                                    style={[
                                        index === 0 && { borderTopWidth: 1 },
                                        index === options.length - 1 && { borderBottomWidth: 1 }
                                    ]}
                                />
                            ))}
                        </View>
                        <VisibilityToggle
                            isVisible={isVisible}
                            onToggle={() => setIsVisible(!isVisible)}
                            activeColor={COLORS.black}
                            style={{ marginTop: 48 }}
                        />
                    </View>
                </PremiumScreenWrapper>
            </ScrollView>
            <View style={sharedStyles.footer}>
                <View style={{ flex: 1 }} />
                <FAB
                    onPress={handleNext}
                    disabled={!selectedGender}
                    hint="Select your gender to continue"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    genderList: {
        marginTop: 10,
    },
});

export default GenderScreen;
