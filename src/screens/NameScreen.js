import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useOnboarding } from '../context/OnboardingContext';
import StepIndicator from '../components/StepIndicator';
import FAB from '../components/FAB';
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import { STEP_ORDER } from '../constants/steps';
import sharedStyles from '../styles/shared';
import PremiumScreenWrapper from '../components/PremiumScreenWrapper';
import WhySheet from '../components/WhySheet';

// m-2: Merged duplicate TouchableOpacity imports into single import line above

const NameScreen = ({ onNext }) => {
    const { dispatch } = useOnboarding();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [whySheetOpen, setWhySheetOpen] = useState(false);

    const currentIndex = STEP_ORDER.indexOf('name');
    const totalSteps = STEP_ORDER.length;

    const handleNext = () => {
        dispatch({ type: 'SET_FIELD', field: 'firstName', value: firstName });
        dispatch({ type: 'SET_FIELD', field: 'lastName', value: lastName });
        onNext();
    };

    return (
        <View style={sharedStyles.screenContainer}>
            <StepIndicator
                currentIndex={currentIndex}
                totalSteps={totalSteps}
            />
            <ScrollView contentContainerStyle={sharedStyles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <PremiumScreenWrapper animateEntrance>
                    <View style={sharedStyles.content}>
                        <Text style={sharedStyles.title}>Let's begin with your name</Text>
                        <View style={styles.form}>
                            <View style={styles.inputContainer}>
                                <TextInput style={styles.input} placeholder="First name (required)" placeholderTextColor={COLORS.lightGray} value={firstName} onChangeText={setFirstName} autoFocus={true} selectionColor={COLORS.black} />
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput style={styles.input} placeholder="Last name" placeholderTextColor={COLORS.lightGray} value={lastName} onChangeText={setLastName} selectionColor={COLORS.black} />
                            </View>
                            <View style={styles.helperTextContainer}>
                                <Text style={styles.helperText}>
                                    Last name is optional, and only shared with matches.{' '}
                                    <Text
                                        style={styles.whyLink}
                                        onPress={() => setWhySheetOpen(true)}
                                    >
                                        Why?
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                </PremiumScreenWrapper>
            </ScrollView>

            <WhySheet
                visible={whySheetOpen}
                onClose={() => setWhySheetOpen(false)}
                icon="lock"
                headline="Your last name, your rules"
                cards={[
                    {
                        icon: "eye",
                        headline: "Only matches see it",
                        body: "Your last name is hidden from public profiles. Revealed only when you both match."
                    },
                    {
                        icon: "settings",
                        headline: "You control it",
                        body: "Change or remove your last name anytime from your profile settings."
                    },
                    {
                        icon: "shield",
                        headline: "We never sell your data",
                        body: "Align doesn't share your personal info with third parties. Ever."
                    }
                ]}
            />
            {/* C-6: Fixed FAB right-alignment — added flex: 1 left spacer */}
            <View style={sharedStyles.footer}>
                <View style={{ flex: 1 }} />
                <FAB
                    onPress={handleNext}
                    disabled={!firstName.trim()}
                    hint="Enter your first name to continue"
                />
            </View>
        </View>
    );
};

// m-3: Converted plain object to StyleSheet.create()
const styles = StyleSheet.create({
    form: {
        flex: 1,
    },
    inputContainer: {
        marginBottom: SPACING.xl,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.black,
    },
    input: {
        fontFamily: 'Inter_400Regular',
        fontSize: 26,
        color: COLORS.text,
        paddingVertical: 10,
        paddingHorizontal: 0,
    },
    helperTextContainer: {
        marginTop: 0,
        marginBottom: SPACING.xxl,
    },
    helperText: {
        fontFamily: 'Inter_400Regular',
        fontSize: 15,
        color: COLORS.text,
        lineHeight: 22,
    },
    whyLink: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 15,
        color: COLORS.black,
        textDecorationLine: 'underline',
    },
    visibilityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: SPACING.lg,
    },
    visibilityText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 15,
        color: COLORS.text,
    },
});

export default NameScreen;
