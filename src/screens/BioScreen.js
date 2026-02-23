import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useOnboarding } from '../context/OnboardingContext';
import StepIndicator from '../components/StepIndicator';
import FAB from '../components/FAB';
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import { STEP_ORDER } from '../constants/steps';
import sharedStyles from '../styles/shared';
import PremiumScreenWrapper from '../components/PremiumScreenWrapper';

const BioScreen = ({ onNext, onBack }) => {
    const { state, dispatch } = useOnboarding();
    const [publicBio, setPublicBio] = useState(state.publicBio || '');
    const [aiBio, setAiBio] = useState(state.aiBio || '');
    const [publicFocused, setPublicFocused] = useState(false);
    const [aiFocused, setAiFocused] = useState(false);

    const currentIndex = STEP_ORDER.indexOf('bio');
    const totalSteps = STEP_ORDER.length;

    const handleNext = () => {
        dispatch({ type: 'SET_FIELD', field: 'publicBio', value: publicBio });
        dispatch({ type: 'SET_FIELD', field: 'aiBio', value: aiBio });
        onNext();
    };

    const isNextDisabled = !publicBio.trim() || !aiBio.trim();

    return (
        <View style={sharedStyles.screenContainer}>
            <StepIndicator
                currentIndex={currentIndex}
                totalSteps={totalSteps}
                onBack={onBack}
                rightAction={
                    <TouchableOpacity onPress={onNext}>
                        <Text style={sharedStyles.skipButtonText}>SKIP</Text>
                    </TouchableOpacity>
                }
            />
            <ScrollView
                contentContainerStyle={[sharedStyles.scrollContent, { paddingBottom: 40 }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <PremiumScreenWrapper animateEntrance>
                    <View style={sharedStyles.content}>
                        <Text style={sharedStyles.title}>Tell us about yourself</Text>
                        <Text style={sharedStyles.bodyText}>Your bio helps us find meaningful connections.</Text>

                        {/* Public Bio Section */}
                        <View style={styles.section}>
                            <View style={styles.labelRow}>
                                <Text style={styles.label}>PUBLIC BIO</Text>
                                <Text style={styles.labelHint}>Visible to matches</Text>
                            </View>
                            <View style={[
                                styles.textAreaContainer,
                                publicFocused && { borderColor: COLORS.primary }
                            ]}>
                                <TextInput
                                    style={styles.textArea}
                                    placeholder="I'm a coffee enthusiast who loves Sunday morning hikes..."
                                    placeholderTextColor="#D1D5DB"
                                    multiline
                                    maxLength={300}
                                    value={publicBio}
                                    onChangeText={setPublicBio}
                                    onFocus={() => setPublicFocused(true)}
                                    onBlur={() => setPublicFocused(false)}
                                    textAlignVertical="top"
                                    selectionColor={COLORS.primary}
                                />
                                <Text style={styles.charCount}>{publicBio.length} / 300</Text>
                            </View>
                        </View>

                        {/* AI Matchmaker Bio Section */}
                        <View style={styles.section}>
                            <View style={styles.labelRow}>
                                <View style={styles.aiLabelContainer}>
                                    <Text style={styles.label}>AI MATCHMAKER BIO</Text>
                                    <View style={styles.privateTag}>
                                        <Text style={styles.privateTagText}>PRIVATE</Text>
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.aiDescription}>
                                Tell our AI what you're truly looking for in a partner. This stays between us.
                            </Text>
                            <View style={[
                                styles.textAreaContainer,
                                styles.aiTextAreaContainer,
                                aiFocused && { borderColor: COLORS.primary, backgroundColor: COLORS.white }
                            ]}>
                                <TextInput
                                    style={styles.textArea}
                                    placeholder="Be specific about values, lifestyle, or your 'must-haves'..."
                                    placeholderTextColor="#9CA3AF"
                                    multiline
                                    maxLength={500}
                                    value={aiBio}
                                    onChangeText={setAiBio}
                                    onFocus={() => setAiFocused(true)}
                                    onBlur={() => setAiFocused(false)}
                                    textAlignVertical="top"
                                    selectionColor={COLORS.primary}
                                />
                                <Text style={styles.charCount}>{aiBio.length} / 500</Text>
                            </View>
                        </View>
                    </View>
                </PremiumScreenWrapper>
            </ScrollView>
            <View style={sharedStyles.footer}>
                <View style={{ flex: 1 }} />
                <FAB onPress={handleNext} disabled={isNextDisabled} hint="Enter both bios to continue" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: SPACING.xl,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: SPACING.sm,
    },
    label: {
        fontFamily: 'Inter_700Bold',
        fontSize: 12,
        color: COLORS.text,
        letterSpacing: 1,
    },
    labelHint: {
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
        color: COLORS.gray,
    },
    aiLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    privateTag: {
        backgroundColor: 'rgba(236, 91, 19, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    privateTagText: {
        fontFamily: 'Inter_700Bold',
        fontSize: 10,
        color: COLORS.primary,
    },
    aiDescription: {
        fontFamily: 'Inter_400Regular',
        fontSize: 13,
        color: COLORS.gray,
        fontStyle: 'italic',
        lineHeight: 18,
        marginBottom: SPACING.sm,
    },
    textAreaContainer: {
        position: 'relative',
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: '#F3F4F6',
        borderRadius: 16,
        minHeight: 140,
        padding: SPACING.md,
        paddingBottom: 24, // Space for character count
    },
    aiTextAreaContainer: {
        backgroundColor: 'rgba(236, 91, 19, 0.05)',
        borderColor: 'transparent',
    },
    textArea: {
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
        color: COLORS.text,
        minHeight: 100,
        lineHeight: 24,
    },
    charCount: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        fontFamily: 'Inter_500Medium',
        fontSize: 10,
        color: '#9CA3AF',
    }
});

export default BioScreen;
