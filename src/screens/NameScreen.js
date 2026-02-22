import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useOnboarding } from '../context/OnboardingContext';
import StepIndicator from '../components/StepIndicator';
import FAB from '../components/FAB';
import COLORS from '../constants/colors';
import { STEP_ORDER } from '../constants/steps';
import sharedStyles from '../styles/shared';
import PremiumScreenWrapper from '../components/PremiumScreenWrapper';

const NameScreen = ({ onNext }) => {
    const { dispatch } = useOnboarding();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const currentIndex = STEP_ORDER.indexOf('name');
    const totalSteps = STEP_ORDER.length;

    const handleNext = () => {
        dispatch({ type: 'SET_FIELD', field: 'firstName', value: firstName });
        dispatch({ type: 'SET_FIELD', field: 'lastName', value: lastName });
        onNext();
    };

    return (
        <View style={sharedStyles.screenContainer}>
            <ScrollView contentContainerStyle={sharedStyles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <View style={sharedStyles.header}>
                    <Text style={styles.disclaimer}>NO BACKGROUND CHECKS ARE CONDUCTED</Text>
                </View>
                <StepIndicator currentIndex={currentIndex} totalSteps={totalSteps} />
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
                                    <Text style={styles.linkText} onPress={() => { }}>Why?</Text>
                                </Text>
                            </View>
                            <View style={styles.visibilityContainer}>
                                <Feather name="eye" size={20} color={COLORS.gray} />
                                <Text style={styles.visibilityText} accessibilityLabel="Your name is always visible on your profile">Always visible on profile</Text>
                            </View>
                        </View>
                    </View>
                </PremiumScreenWrapper>
            </ScrollView>
            <View style={sharedStyles.footer}>
                <FAB
                    onPress={handleNext}
                    disabled={!firstName.trim()}
                    hint="Enter your first name to continue"
                />
            </View>
        </View>
    );
};

const styles = {
    disclaimer: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 11,
        color: '#9CA3AF',
        letterSpacing: 1.5,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    form: {
        flex: 1,
    },
    inputContainer: {
        marginBottom: 35,
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
        marginBottom: 45,
    },
    helperText: {
        fontFamily: 'Inter_400Regular',
        fontSize: 15,
        color: COLORS.text,
        lineHeight: 22,
    },
    linkText: {
        color: '#4C1D95',
        fontFamily: 'Inter_600SemiBold',
    },
    visibilityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    visibilityText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 15,
        color: COLORS.text,
    },
};

export default NameScreen;
