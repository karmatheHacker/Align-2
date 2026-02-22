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

const ReligionScreen = ({ onNext, onBack }) => {
    const { dispatch } = useOnboarding();
    const [selectedBeliefs, setSelectedBeliefs] = useState([]);
    const [isVisible, setIsVisible] = useState(true);

    const currentIndex = STEP_ORDER.indexOf('religion');
    const totalSteps = STEP_ORDER.length;

    const handleNext = () => {
        dispatch({ type: 'SET_FIELD', field: 'religion', value: selectedBeliefs });
        dispatch({ type: 'SET_FIELD', field: 'isVisible', key: 'religion', value: isVisible });
        onNext();
    };

    const beliefs = [
        { id: 'Christian', label: 'Christian' },
        { id: 'Hindu', label: 'Hindu' },
        { id: 'Jewish', label: 'Jewish' },
        { id: 'Muslim', label: 'Muslim' },
        { id: 'Sikh', label: 'Sikh' },
        { id: 'Spiritual', label: 'Spiritual' },
        { id: 'Other', label: 'Other' },
    ];

    const toggleBelief = (id) => {
        if (id === 'private') {
            setSelectedBeliefs(['private']);
        } else {
            setSelectedBeliefs(prev => {
                const filtered = prev.filter(b => b !== 'private');
                return filtered.includes(id)
                    ? filtered.filter(b => b !== id)
                    : [...filtered, id];
            });
        }
    };

    return (
        <View style={sharedStyles.screenContainer}>
            <View style={sharedStyles.header}>
                <BackButton onPress={onBack} />
            </View>
            <StepIndicator currentIndex={currentIndex} totalSteps={totalSteps} />

            <ScrollView contentContainerStyle={sharedStyles.scrollContent} showsVerticalScrollIndicator={false}>
                <PremiumScreenWrapper>
                    <View style={sharedStyles.content}>
                        <Text style={sharedStyles.title}>The faith and beliefs that guide you</Text>
                        <View style={sharedStyles.intentionList}>
                            {beliefs.map((belief) => (
                                <OptionRow
                                    key={belief.id}
                                    label={belief.label}
                                    selected={selectedBeliefs.includes(belief.id)}
                                    onPress={() => toggleBelief(belief.id)}
                                    activeColor={COLORS.black}
                                    variant="checkbox"
                                    style={sharedStyles.intentionOption}
                                />
                            ))}

                            <View style={{ marginTop: 24 }}>
                                <OptionRow
                                    label="Prefer not to say"
                                    description="This will limit who sees your profile. Learn more"
                                    selected={selectedBeliefs.includes('private')}
                                    onPress={() => toggleBelief('private')}
                                    activeColor={COLORS.black}
                                    variant="checkbox"
                                    style={[sharedStyles.intentionOption, { borderBottomWidth: 0 }]}
                                />
                            </View>
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
                <Text style={styles.brandingText}>Align © 2024</Text>
            </View>

            <View style={sharedStyles.footer}>
                <View style={{ flex: 1 }} />
                <FAB onPress={handleNext} disabled={selectedBeliefs.length === 0} hint="Select your beliefs to continue" />
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

export default ReligionScreen;
