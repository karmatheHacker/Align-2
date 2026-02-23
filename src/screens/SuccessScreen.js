import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useOnboarding } from '../context/OnboardingContext';
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import sharedStyles from '../styles/shared';
import PremiumScreenWrapper from '../components/PremiumScreenWrapper';

// C-8: Accept onComplete prop to wire actual navigation on success
const SuccessScreen = ({ onComplete }) => {
    const { state } = useOnboarding();
    return (
        <View style={sharedStyles.screenContainer}>
            <PremiumScreenWrapper animateEntrance>
                <View style={[sharedStyles.content, styles.successContent]}>
                    <MaterialIcons name="check-circle" size={64} color={COLORS.black} />
                    <Text style={[sharedStyles.title, styles.successTitle]}>
                        You're all set, {state.firstName}!
                    </Text>
                    <Text style={[sharedStyles.bodyText, styles.successBody]}>
                        Your profile is live.
                    </Text>

                    <TouchableOpacity
                        style={[sharedStyles.primaryButton, styles.successButton]}
                        activeOpacity={0.8}
                        // C-8: Replace console.log with actual navigation via onComplete prop
                        onPress={() => onComplete?.()}
                    >
                        <Text style={sharedStyles.pillButtonText}>Go to App</Text>
                    </TouchableOpacity>
                </View>
            </PremiumScreenWrapper>
        </View>
    );
};

const styles = StyleSheet.create({
    successContent: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: SPACING.xxl,
    },
    successTitle: {
        textAlign: 'center',
        marginTop: SPACING.xl,
        fontSize: 32,
    },
    successBody: {
        textAlign: 'center',
        color: COLORS.gray,
        marginTop: SPACING.md,
        fontSize: 16,
    },
    successButton: {
        marginTop: SPACING.xxl,
        width: '100%',
    },
});

export default SuccessScreen;
