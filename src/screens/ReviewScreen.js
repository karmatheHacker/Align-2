import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useOnboarding } from '../context/OnboardingContext';
import StepIndicator from '../components/StepIndicator';
import FAB from '../components/FAB';
import PremiumScreenWrapper from '../components/PremiumScreenWrapper';
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import { STEP_ORDER } from '../constants/steps';
import sharedStyles from '../styles/shared';
import validateProfile from '../utils/validateProfile';
import submitProfile from '../utils/submitProfile';

const ReviewScreen = ({ onBack, onSuccess }) => {
    const { state } = useOnboarding();
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [errors, setErrors] = useState({});
    const scrollRef = useRef(null);
    const sectionLayouts = useRef({});

    const handleSubmit = async () => {
        const validation = validateProfile(state);
        if (!validation.isValid) {
            setErrors(validation.errors);
            const firstErrorField = Object.keys(validation.errors)[0];
            const yPos = sectionLayouts.current[firstErrorField];
            if (yPos !== undefined) {
                scrollRef.current?.scrollTo({ y: yPos - 20, animated: true });
            }
            return;
        }

        setSubmitting(true);
        setSubmitError(null);
        try {
            await submitProfile(state);
            onSuccess();
        } catch (err) {
            setSubmitError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const renderSection = (id, label, value) => {
        const error = errors[id];
        if ((value === null || (Array.isArray(value) && value.length === 0)) && !error) return null;

        let displayValue = value;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            if (value.day) displayValue = `${value.day}/${value.month}/${value.year}`;
            else if (value.value) displayValue = `${value.value} ${value.unit}`;
        } else if (Array.isArray(value)) {
            if (id === 'photos') displayValue = `${value.length} photos uploaded`;
            else displayValue = value.join(', ');
        }

        return (
            <View
                key={id}
                style={styles.reviewItem}
                onLayout={(e) => { sectionLayouts.current[id] = e.nativeEvent.layout.y; }}
            >
                <Text style={styles.reviewLabel}>{label}</Text>
                <Text style={styles.reviewValue}>{String(displayValue || 'Not provided')}</Text>
                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
        );
    };

    return (
        <View style={sharedStyles.screenContainer}>
            {/* C-3: Replace manual BackButton + header with StepIndicator */}
            <StepIndicator
                currentIndex={STEP_ORDER.length}
                totalSteps={STEP_ORDER.length}
                onBack={onBack}
            />
            {submitError && (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorBannerText}>{submitError}</Text>
                    <View style={styles.retryButton}>
                        <Text style={styles.retryButtonText} onPress={handleSubmit}>Try again</Text>
                    </View>
                </View>
            )}
            {/* C-2: Submit button moved out of ScrollView into pinned footer */}
            <ScrollView ref={scrollRef} contentContainerStyle={sharedStyles.scrollContent} showsVerticalScrollIndicator={false}>
                <PremiumScreenWrapper animateEntrance>
                    <View style={sharedStyles.content}>
                        <Text style={[sharedStyles.title, { marginBottom: SPACING.xl }]}>Review your profile</Text>
                        {renderSection('firstName', 'First Name', state.firstName)}
                        {renderSection('lastName', 'Last Name', state.lastName)}
                        {renderSection('birthday', 'Birthday', state.birthday)}
                        {renderSection('gender', 'Gender', state.gender)}
                        {renderSection('sexuality', 'Sexuality', state.sexuality)}
                        {renderSection('relationshipType', 'Relationship', state.relationshipType)}
                        {renderSection('datingIntention', 'Intention', state.datingIntention)}
                        {renderSection('height', 'Height', state.height)}
                        {renderSection('hometown', 'Hometown', state.hometown)}
                        {renderSection('workplace', 'Workplace', state.workplace)}
                        {renderSection('education', 'Education', state.education)}
                        {renderSection('school', 'School', state.school)}
                        {renderSection('religion', 'Religion', state.religion)}
                        {renderSection('children', 'Children', state.children)}
                        {renderSection('tobacco', 'Tobacco', state.tobacco)}
                        {renderSection('drinking', 'Drinking', state.drinking)}
                        {renderSection('publicBio', 'Public Bio', state.publicBio)}
                        {renderSection('aiBio', 'AI Matchmaker Bio', state.aiBio)}
                        {renderSection('photos', 'Photos', state.photos)}
                    </View>
                </PremiumScreenWrapper>
            </ScrollView>
            {/* C-2: Pinned footer with FAB */}
            <View style={sharedStyles.footer}>
                <View style={{ flex: 1 }} />
                <FAB
                    onPress={handleSubmit}
                    disabled={submitting}
                    hint="Fix errors above to submit"
                    accessibilityLabel={submitting ? 'Submitting profile…' : 'Submit profile'}
                >
                    {submitting && <ActivityIndicator color={COLORS.white} />}
                </FAB>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    reviewItem: {
        marginBottom: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: SPACING.md,
    },
    reviewLabel: {
        fontFamily: 'Inter_500Medium',
        fontSize: 13,
        color: COLORS.gray,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: SPACING.sm,
    },
    reviewValue: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 18,
        color: COLORS.text,
    },
    errorText: {
        color: COLORS.error, // m-5: was '#ef4444', now tokenised
        fontSize: 12,
        marginTop: SPACING.xs,
        fontFamily: 'Inter_500Medium',
    },
    errorBanner: {
        backgroundColor: '#FEE2E2',
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: SPACING.sm,
        marginHorizontal: SPACING.lg,
        borderRadius: 12,
    },
    errorBannerText: {
        color: '#991B1B',
        flex: 1,
        fontFamily: 'Inter_500Medium',
        fontSize: 13,
    },
    retryButton: {
        marginLeft: SPACING.md,
        backgroundColor: '#991B1B',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    retryButtonText: {
        color: COLORS.white,
        fontSize: 12,
        fontFamily: 'Inter_600SemiBold',
    },
});

export default ReviewScreen;
