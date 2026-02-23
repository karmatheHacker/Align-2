import React, { useRef } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useOnboarding } from '../context/OnboardingContext';
import StepIndicator from '../components/StepIndicator';
import BackButton from '../components/BackButton';
import FAB from '../components/FAB';
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import { STEP_ORDER } from '../constants/steps';
import sharedStyles from '../styles/shared';
import PremiumScreenWrapper from '../components/PremiumScreenWrapper';

const BirthdayScreen = ({ onNext, digits, setDigits, onBack }) => {
    const inputRefs = useRef([]);

    const currentIndex = STEP_ORDER.indexOf('birthday');
    const totalSteps = STEP_ORDER.length;

    const handleDigitChange = (value, index) => {
        const newDigits = [...digits];
        newDigits[index] = value;
        setDigits(newDigits);
        if (value.length > 0 && index < 7) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && digits[index] === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const isComplete = digits.every(d => d !== '');

    return (
        <View style={[sharedStyles.screenContainer, { backgroundColor: COLORS.warmCream }]}>
            <StepIndicator
                currentIndex={currentIndex}
                totalSteps={totalSteps}
                onBack={onBack}
                backgroundColor={COLORS.warmCream}
            />
            <ScrollView contentContainerStyle={sharedStyles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <PremiumScreenWrapper animateEntrance>
                    <View style={sharedStyles.content}>
                        <Text style={sharedStyles.title}>Your story began on</Text>
                        <View style={styles.dobContainer}>
                            <View style={styles.digitGroup}>
                                {[0, 1].map((i) => (
                                    <TextInput key={i} ref={(ref) => (inputRefs.current[i] = ref)}
                                        style={[styles.dobInput, digits[i] !== '' && styles.dobInputActive]}
                                        keyboardType="number-pad" maxLength={1} placeholder="D"
                                        placeholderTextColor={COLORS.lightGray} value={digits[i]}
                                        onChangeText={(val) => handleDigitChange(val, i)}
                                        onKeyPress={(e) => handleKeyPress(e, i)} autoFocus={i === 0}
                                    />
                                ))}
                            </View>
                            <View style={styles.digitGroup}>
                                {[2, 3].map((i) => (
                                    <TextInput key={i} ref={(ref) => (inputRefs.current[i] = ref)}
                                        style={[styles.dobInput, digits[i] !== '' && styles.dobInputActive]}
                                        keyboardType="number-pad" maxLength={1} placeholder="M"
                                        placeholderTextColor={COLORS.lightGray} value={digits[i]}
                                        onChangeText={(val) => handleDigitChange(val, i)}
                                    />
                                ))}
                            </View>
                            <View style={styles.digitGroup}>
                                {[4, 5, 6, 7].map((i) => (
                                    <TextInput key={i} ref={(ref) => (inputRefs.current[i] = ref)}
                                        style={[styles.dobInput, digits[i] !== '' && styles.dobInputActive]}
                                        keyboardType="number-pad" maxLength={1} placeholder="Y"
                                        placeholderTextColor={COLORS.lightGray} value={digits[i]}
                                        onChangeText={(val) => handleDigitChange(val, i)}
                                        onKeyPress={(e) => handleKeyPress(e, i)}
                                        selectionColor={COLORS.black}
                                    />
                                ))}
                            </View>
                        </View>
                    </View>
                </PremiumScreenWrapper>
            </ScrollView>
            <View style={[sharedStyles.footer, { backgroundColor: COLORS.warmCream }]}>
                <Text style={sharedStyles.footerHelperText}>We use this to calculate the age on your profile.</Text>
                <FAB
                    onPress={onNext}
                    disabled={!isComplete}
                    hint="Fill in your date of birth to continue"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    dobContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    digitGroup: {
        flexDirection: 'row',
        gap: 2, // Tighter gap for better fit
    },
    dobInput: {
        width: 32, // Reduced from 44 to fit smaller screens
        borderBottomWidth: 2,
        borderBottomColor: COLORS.inactiveBorder,
        fontFamily: 'Inter_500Medium',
        fontSize: 18, // Slightly larger font for readability
        color: COLORS.text,
        textAlign: 'center',
        paddingVertical: 10,
    },
    dobInputActive: {
        borderBottomColor: COLORS.black,
    },
});

export default BirthdayScreen;