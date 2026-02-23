import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image, ScrollView, Dimensions } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useOnboarding } from '../context/OnboardingContext';
import StepIndicator from '../components/StepIndicator';
import FAB from '../components/FAB';
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';
import { STEP_ORDER } from '../constants/steps';
import sharedStyles from '../styles/shared';
import PremiumScreenWrapper from '../components/PremiumScreenWrapper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const VerificationScreen = ({ onNext, onBack }) => {
    const currentIndex = STEP_ORDER.indexOf('verification');
    const totalSteps = STEP_ORDER.length;

    // Animations
    const scanPulse = useRef(new Animated.Value(0)).current;
    const scanLine = useRef(new Animated.Value(0)).current;
    const processingPing = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Scanning Pulse Animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanPulse, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(scanPulse, {
                    toValue: 0,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Scanning Line Animation
        Animated.loop(
            Animated.timing(scanLine, {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Processing Ping Animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(processingPing, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(processingPing, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    const ringScale = scanPulse.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.05],
    });

    const ringOpacity = scanPulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.1, 0.4],
    });

    const translateYLine = scanLine.interpolate({
        inputRange: [0, 1],
        outputRange: [0, SCREEN_WIDTH - 64 > 320 ? 320 : SCREEN_WIDTH - 64],
    });

    const pingScale = processingPing.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 2.5],
    });

    const pingOpacity = processingPing.interpolate({
        inputRange: [0, 1],
        outputRange: [0.6, 0],
    });

    return (
        <View style={sharedStyles.screenContainer}>
            <StepIndicator
                currentIndex={currentIndex}
                totalSteps={totalSteps}
                onBack={onBack}
            />

            <ScrollView
                contentContainerStyle={sharedStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <PremiumScreenWrapper animateEntrance>
                    <View style={styles.container}>
                        <View style={styles.iconContainer}>
                            <MaterialIcons name="verified-user" size={48} color={COLORS.black} />
                        </View>

                        <Text style={sharedStyles.title}>Let's verify you're you</Text>
                        <Text style={sharedStyles.bodyText}>
                            Align uses AI to make sure everyone is who they say they are.
                        </Text>

                        <View style={styles.selfieContainer}>
                            <Image
                                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiqmVUNJi2SlCH667OAup5Msg3y0Nxqs7nklae85WYTJCFLyZBhsw-PHY7V_VT67NzXcqu56xJh5frJlv11UkE-1Dy2Xm1axqFAPka73Alahnh6ck71UQV3B4k4hqChKm9vHitKEOcXNicucaBqTtH2Cfg8Fh2IFDbnA_GGzigLnQB5LrHh4-oLN2W15CQK1sshMsZd7v5QGvppC26dit7B2wqQhu-IypIWYy2kqrN6OD9aJqrzExrenyl7dZtMqRD7i6X-2Qbmlo' }}
                                style={styles.cameraImage}
                            />
                            {/* Scanning Pulse Ring Overlay */}
                            <Animated.View style={[
                                styles.scanningRing,
                                {
                                    transform: [{ scale: ringScale }],
                                    opacity: ringOpacity,
                                }
                            ]} />
                            {/* Scanning Line */}
                            <Animated.View style={[
                                styles.scanLine,
                                {
                                    transform: [{ translateY: translateYLine }]
                                }
                            ]} />
                        </View>

                        <View style={styles.processingRow}>
                            <View style={styles.pingContainer}>
                                <Animated.View style={[
                                    styles.processingDot,
                                    {
                                        transform: [{ scale: pingScale }],
                                        opacity: pingOpacity,
                                    }
                                ]} />
                                <View style={styles.processingDot} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.processingLabel}>PROCESSING...</Text>
                                <Text style={styles.disclaimerText}>
                                    This photo is only for verification and won't be shown on your profile.
                                </Text>
                            </View>
                        </View>
                    </View>
                </PremiumScreenWrapper>
            </ScrollView>

            <View style={sharedStyles.footer}>
                <View style={{ flex: 1 }} />
                <FAB onPress={onNext} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingBottom: SPACING.xl,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: SPACING.lg,
    },
    selfieContainer: {
        width: SCREEN_WIDTH - 64,
        height: SCREEN_WIDTH - 64,
        maxWidth: 320,
        maxHeight: 320,
        borderRadius: (SCREEN_WIDTH - 64) / 2,
        borderWidth: 2,
        borderColor: COLORS.black,
        alignSelf: 'center',
        overflow: 'hidden',
        marginVertical: SPACING.lg,
        position: 'relative',
    },
    cameraImage: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
        tintColor: 'gray',
    },
    scanningRing: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 9999,
        borderWidth: 4,
        borderColor: COLORS.black,
    },
    scanLine: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    },
    processingRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: SPACING.xl,
        gap: SPACING.sm,
        marginTop: SPACING.sm,
    },
    pingContainer: {
        width: 12,
        height: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2, // Align with first line of text
    },
    processingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.black,
        position: 'absolute',
    },
    processingLabel: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 11,
        color: COLORS.black,
        letterSpacing: 1.5,
    },
    disclaimerText: {
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
        color: COLORS.gray,
        textAlign: 'left',
        marginTop: 4,
        lineHeight: 18,
    },
});

export default VerificationScreen;
