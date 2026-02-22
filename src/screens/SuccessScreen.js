import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useOnboarding } from '../context/OnboardingContext';
import COLORS from '../constants/colors';
import sharedStyles from '../styles/shared';
import PremiumScreenWrapper from '../components/PremiumScreenWrapper';

const SuccessScreen = () => {
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
                        onPress={() => console.log('Final Redirect to App Root')}
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
        paddingHorizontal: 40,
    },
    successTitle: {
        textAlign: 'center',
        marginTop: 32,
        fontSize: 32,
    },
    successBody: {
        textAlign: 'center',
        color: COLORS.gray,
        marginTop: 12,
        fontSize: 16,
    },
    successButton: {
        marginTop: 48,
        width: '100%',
    },
});

export default SuccessScreen;
