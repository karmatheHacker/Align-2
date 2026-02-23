import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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

const DatingIntentionScreen = ({ onNext, onBack }) => {
    const { dispatch } = useOnboarding();
    const [selectedIntention, setSelectedIntention] = useState(null);
    const [customText, setCustomText] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const [infoSheetOpen, setInfoSheetOpen] = useState(false);

    const currentIndex = STEP_ORDER.indexOf('datingIntention');
    const totalSteps = STEP_ORDER.length;

    const handleNext = () => {
        dispatch({ type: 'SET_FIELD', field: 'datingIntention', value: selectedIntention });
        dispatch({ type: 'SET_FIELD', field: 'isVisible', key: 'datingIntention', value: isVisible });
        onNext();
    };

    const options = [
        { id: 'life-partner', label: 'Life partner' },
        { id: 'long-term', label: 'Long-term relationship' },
        { id: 'long-term-open', label: 'Long-term relationship, open to short' },
        { id: 'short-term-open', label: 'Short-term relationship, open to long' },
        { id: 'short-term', label: 'Short-term relationship' },
        { id: 'figuring', label: 'Figuring out my dating goals' },
        { id: 'prefer-not', label: 'Prefer not to say' },
    ];

    return (
        <View style={sharedStyles.screenContainer}>
            <StepIndicator currentIndex={currentIndex} totalSteps={totalSteps} onBack={onBack} />
            <ScrollView contentContainerStyle={sharedStyles.scrollContent} showsVerticalScrollIndicator={false}>
                <PremiumScreenWrapper>
                    <View style={sharedStyles.content}>
                        <Text style={sharedStyles.title}>Your intention for being here</Text>
                        <View style={sharedStyles.intentionList}>
                            {options.map((option) => (
                                <OptionRow key={option.id} label={option.label} selected={selectedIntention === option.id} onPress={() => setSelectedIntention(option.id)} activeColor={COLORS.black} variant="radio" style={sharedStyles.intentionOption} />
                            ))}
                        </View>
                        <View style={styles.dashedContainer}>
                            <TextInput style={styles.dashedTextArea} placeholder="Share more about what you're looking for in your own words" placeholderTextColor={COLORS.gray} multiline numberOfLines={3} value={customText} onChangeText={setCustomText} selectionColor={COLORS.black} />
                            <View style={[styles.addIconCircle, { backgroundColor: COLORS.black }]}><MaterialIcons name="add" size={20} color={COLORS.white} /></View>
                        </View>
                        {/* M-7: Moved visibilityToggleRowStandalone inside content View */}
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
                                fieldName="datingIntention"
                                isVisible={isVisible}
                                onClose={() => setInfoSheetOpen(false)}
                            />
                        )}
                    </View>
                </PremiumScreenWrapper>
            </ScrollView>
            <View style={sharedStyles.footer}>
                <View style={{ flex: 1 }} />
                <FAB onPress={handleNext} disabled={!selectedIntention} hint="Select your intention to continue" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    dashedContainer: {
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: SPACING.md,
        backgroundColor: 'rgba(255,255,255,0.4)',
        marginTop: SPACING.lg,
        marginBottom: SPACING.xl,
    },
    dashedTextArea: {
        flex: 1,
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
        color: '#374151',
        padding: 0,
        textAlignVertical: 'top',
        minHeight: 80,
    },
    addIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.black,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: SPACING.md, // m-9: was 12 (off-grid), now SPACING.md = 16
    },
    visibilityTopBorderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 24,
        paddingHorizontal: 0,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        marginTop: 'auto',
    },
});

export default DatingIntentionScreen;
