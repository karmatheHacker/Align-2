import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Easing, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useOnboarding } from '../context/OnboardingContext';
import { HOME_COLORS } from '../constants/homeColors';
import MatchCard from '../components/MatchCard';

const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'evening';
};

export default function StitchHomeScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { state: profile } = useOnboarding();

    // Animation Values
    const heroOpacity = useRef(new Animated.Value(0)).current;
    const heroY = useRef(new Animated.Value(20)).current;

    const dotPulse1 = useRef(new Animated.Value(1)).current;
    const dotPulse2 = useRef(new Animated.Value(1)).current;
    const dotPulse3 = useRef(new Animated.Value(1)).current;

    const cardAlexOpacity = useRef(new Animated.Value(0)).current;
    const cardAlexY = useRef(new Animated.Value(40)).current;
    const cardJordanOpacity = useRef(new Animated.Value(0)).current;
    const cardJordanY = useRef(new Animated.Value(40)).current;

    const askBarOpacity = useRef(new Animated.Value(0)).current;
    const askBarY = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        // Simple entrance
        Animated.parallel([
            Animated.timing(heroOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(heroY, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]).start();

        // Cards slide in
        Animated.sequence([
            Animated.delay(400),
            Animated.parallel([
                Animated.timing(cardAlexOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.timing(cardAlexY, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            ]),
        ]).start();

        Animated.sequence([
            Animated.delay(600),
            Animated.parallel([
                Animated.timing(cardJordanOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.timing(cardJordanY, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            ]),
        ]).start();

        // Ask bar
        Animated.sequence([
            Animated.delay(800),
            Animated.parallel([
                Animated.timing(askBarOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(askBarY, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            ]),
        ]).start();

        // Pulsing dots loop
        const createPulse = (anim, delay) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(anim, { toValue: 1.4, duration: 500, useNativeDriver: true }),
                    Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }),
                ])
            );

        createPulse(dotPulse1, 0).start();
        createPulse(dotPulse2, 150).start();
        createPulse(dotPulse3, 300).start();
    }, []);

    const handleAskPress = () => {
        navigation.navigate('AlignChat');
    };

    const firstName = profile?.firstName || "there";
    const timeOfDay = getTimeOfDay();

    return (
        <View style={{ flex: 1, backgroundColor: HOME_COLORS.background }}>
            <StatusBar style="dark" />
            <View style={{ flex: 1, paddingTop: insets.top }}>
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        paddingHorizontal: 24,
                        paddingBottom: insets.bottom + 96
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Compact Hero Section */}
                    <Animated.View style={{
                        marginTop: 24,
                        opacity: heroOpacity,
                        transform: [{ translateY: heroY }]
                    }}>
                        <Text style={styles.greetingText}>Good {timeOfDay},</Text>
                        <Text
                            style={styles.nameText}
                            maxFontSizeMultiplier={1.2}
                            numberOfLines={1}
                        >
                            {firstName}
                        </Text>
                        <Text style={styles.heroSubText}>YOUR BEST MATCH TODAY</Text>
                    </Animated.View>

                    {/* Finding Row */}
                    <View style={styles.findingRow}>
                        <View style={styles.dotContainer}>
                            <Animated.View style={[styles.pulseDot, { backgroundColor: HOME_COLORS.dotYellow, transform: [{ scale: dotPulse1 }] }]} />
                            <Animated.View style={[styles.pulseDot, { backgroundColor: HOME_COLORS.dotRed, transform: [{ scale: dotPulse2 }] }]} />
                            <Animated.View style={[styles.pulseDot, { backgroundColor: HOME_COLORS.dotGreen, transform: [{ scale: dotPulse3 }] }]} />
                        </View>
                        <Text style={styles.findingText}>FINDING YOUR MATCHES</Text>
                    </View>

                    {/* Match Cards */}
                    <Animated.View style={{ opacity: cardAlexOpacity, transform: [{ translateY: cardAlexY }] }}>
                        <MatchCard
                            rank="top"
                            name="ALEX"
                            score={98}
                            initials="AR"
                            onViewPress={() => navigation.navigate('ProfileDetail')}
                        />
                    </Animated.View>

                    <Animated.View style={{ opacity: cardJordanOpacity, transform: [{ translateY: cardJordanY }] }}>
                        <MatchCard
                            rank="runner"
                            name="JORDAN"
                            score={84}
                            initials="JD"
                            tagline="Shared interests in Architecture and Minimalism."
                            onViewPress={() => navigation.navigate('ProfileDetail')}
                        />
                    </Animated.View>

                    {/* Ask Align Anything Bar */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleAskPress}
                        style={styles.askBarContainer}
                    >
                        <Animated.View style={[styles.askBar, { opacity: askBarOpacity, transform: [{ translateY: askBarY }] }]}>
                            <View style={styles.askBarContent}>
                                <Ionicons name="mic-outline" size={20} color={HOME_COLORS.text} />
                                <Text style={styles.askPlaceholder}>Ask Align anything...</Text>
                            </View>
                            <View style={styles.sendButtonFill}>
                                <MaterialIcons name="arrow-upward" size={20} color={HOME_COLORS.white} />
                            </View>
                        </Animated.View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    greetingText: {
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
        color: HOME_COLORS.textMuted,
    },
    nameText: {
        fontSize: 40,
        fontWeight: '900',
        color: HOME_COLORS.text,
        letterSpacing: -1,
        textTransform: 'uppercase',
    },
    heroSubText: {
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 3,
        color: HOME_COLORS.textMuted,
        textTransform: 'uppercase',
        marginTop: 4,
    },
    findingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 16,
        marginBottom: 20,
    },
    dotContainer: {
        flexDirection: 'row',
        gap: 6,
    },
    pulseDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    findingText: {
        fontSize: 10,
        fontWeight: '700',
        color: HOME_COLORS.textMuted,
        letterSpacing: 2.5,
    },
    askBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: HOME_COLORS.white,
        borderRadius: 32,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginTop: 8,
        borderWidth: 1,
        borderColor: HOME_COLORS.border,
    },
    askBarContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    askPlaceholder: {
        fontSize: 13,
        fontWeight: '500',
        color: HOME_COLORS.textMuted,
    },
    sendButtonFill: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: HOME_COLORS.text,
        alignItems: 'center',
        justifyContent: 'center',
    },
    askBarContainer: {
        marginTop: 8,
    },
});
