import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
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

const ReligionScreen = ({ onNext, onBack }) => {
    const { dispatch } = useOnboarding();
    const [selectedBeliefs, setSelectedBeliefs] = useState([]);
    const [isVisible, setIsVisible] = useState(true);
    const [infoSheetOpen, setInfoSheetOpen] = useState(false);

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
            <StepIndicator currentIndex={currentIndex} totalSteps={totalSteps} onBack={onBack} />

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

                            <View style={{ marginTop: SPACING.lg }}>
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
                                fieldName="religion"
                                isVisible={isVisible}
                                onClose={() => setInfoSheetOpen(false)}
                            />
                        )}
                    </View>
                </PremiumScreenWrapper>
            </ScrollView>

            {/* C-5: Deleted "Align © 2024" branding block (dead styles also removed below) */}
            <View style={sharedStyles.footer}>
                <View style={{ flex: 1 }} />
                {/* m-1: Fixed </View > trailing space */}
                <FAB onPress={handleNext} disabled={selectedBeliefs.length === 0} hint="Select your beliefs to continue" />
            </View>
        </View>
    );
};

// C-5: Deleted dead styles visibilityToggleCard, p8, brandingText
const styles = StyleSheet.create({});

export default ReligionScreen;
