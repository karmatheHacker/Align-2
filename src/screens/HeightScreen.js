import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useOnboarding } from '../context/OnboardingContext';
import StepIndicator from '../components/StepIndicator';
import FAB from '../components/FAB';
import VisibilityToggle from '../components/VisibilityToggle';
import VisibilityInfoSheet from '../components/VisibilityInfoSheet';
import PremiumScreenWrapper from '../components/PremiumScreenWrapper';
import COLORS from '../constants/colors';
import { STEP_ORDER } from '../constants/steps';
import SPACING from '../constants/spacing';
import sharedStyles from '../styles/shared';

const HeightScreen = ({ onNext, onBack }) => {
    const { dispatch } = useOnboarding();
    const [unit, setUnit] = useState('FT');
    const [selectedHeight, setSelectedHeight] = useState(70); // 5'10" default
    const [isVisible, setIsVisible] = useState(true);
    const [infoSheetOpen, setInfoSheetOpen] = useState(false);

    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollRef = useRef(null);
    const ITEM_HEIGHT = 80;

    const currentIndex = STEP_ORDER.indexOf('height');
    const totalSteps = STEP_ORDER.length;

    const heightOptions = unit === 'FT'
        ? Array.from({ length: 37 }, (_, i) => i + 48) // 4'0" (48) to 7'0" (84)
        : Array.from({ length: 91 }, (_, i) => i + 120); // 120cm to 210cm

    // C-7: Deleted console.log for height options

    const handleNext = () => {
        dispatch({ type: 'SET_FIELD', field: 'height', value: { value: selectedHeight, unit } });
        dispatch({ type: 'SET_FIELD', field: 'isVisible', key: 'height', value: isVisible });
        onNext();
    };

    const handleSkip = () => {
        dispatch({ type: 'SET_FIELD', field: 'height', value: null });
        onNext();
    };

    const handleUnitToggle = (newUnit) => {
        if (unit === newUnit) return;
        let newValue = newUnit === 'CM' ? Math.round(selectedHeight * 2.54) : Math.round(selectedHeight / 2.54);
        setUnit(newUnit);
        setSelectedHeight(newValue);
    };

    // Auto-scroll on mount and unit change
    React.useEffect(() => {
        const scrollToDefault = () => {
            const index = heightOptions.indexOf(selectedHeight);
            if (index !== -1) {
                scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: false });
            }
        };

        // Run immediately and with a small delay for mount stability
        scrollToDefault();
        const timer = setTimeout(scrollToDefault, 100);
        return () => clearTimeout(timer);
    }, [unit]);

    const onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
    );

    const onMomentumScrollEnd = (event) => {
        const y = event.nativeEvent.contentOffset.y;
        const index = Math.round(y / ITEM_HEIGHT);
        if (heightOptions[index]) {
            setSelectedHeight(heightOptions[index]);
        }
    };

    return (
        <View style={sharedStyles.screenContainer}>
            <StepIndicator
                currentIndex={currentIndex}
                totalSteps={totalSteps}
                onBack={onBack}
                rightAction={
                    <TouchableOpacity onPress={handleSkip} style={styles.skipContainer}>
                        <Text style={styles.skipButtonText} numberOfLines={1}>SKIP</Text>
                    </TouchableOpacity>
                }
            />
            <ScrollView contentContainerStyle={sharedStyles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <PremiumScreenWrapper animateEntrance>
                    <View style={sharedStyles.content}>
                        <Text style={[sharedStyles.title, { textAlign: 'center' }]}>Your natural stature</Text>
                        <Text style={[sharedStyles.bodyText, { textAlign: 'center', marginBottom: SPACING.md }]}>
                            How you stand in the world.
                        </Text>

                        {/* Unit Toggle Row */}
                        <View style={styles.unitToggleRow}>
                            <TouchableOpacity onPress={() => handleUnitToggle('FT')} style={styles.arrowButton}>
                                <Feather name="chevron-left" size={24} color={unit === 'FT' ? COLORS.black : '#D1D5DB'} />
                            </TouchableOpacity>
                            <View style={styles.unitLabels}>
                                <Text style={[styles.unitText, unit === 'FT' && styles.unitTextActive]}>FT</Text>
                                <Text style={styles.unitDivider}>/</Text>
                                <Text style={[styles.unitText, unit === 'CM' && styles.unitTextActive]}>CM</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleUnitToggle('CM')} style={styles.arrowButton}>
                                <Feather name="chevron-right" size={24} color={unit === 'CM' ? COLORS.black : '#D1D5DB'} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.staturePickerHero}>
                            <View style={styles.pickerSelectionRing} pointerEvents="none" />
                            <Animated.ScrollView
                                ref={scrollRef}
                                showsVerticalScrollIndicator={false}
                                snapToInterval={ITEM_HEIGHT}
                                decelerationRate="fast"
                                onScroll={onScroll}
                                onMomentumScrollEnd={onMomentumScrollEnd}
                                scrollEventThrottle={16}
                                contentContainerStyle={{ paddingVertical: 160 }}
                                style={{ flex: 1 }}
                                nestedScrollEnabled={true}
                            >
                                {heightOptions.map((item, index) => {
                                    const inputRange = [
                                        (index - 2) * ITEM_HEIGHT,
                                        (index - 1) * ITEM_HEIGHT,
                                        index * ITEM_HEIGHT,
                                        (index + 1) * ITEM_HEIGHT,
                                        (index + 2) * ITEM_HEIGHT,
                                    ];

                                    const opacity = scrollY.interpolate({
                                        inputRange,
                                        outputRange: [0.2, 0.5, 1, 0.5, 0.2],
                                        extrapolate: 'clamp',
                                    });

                                    const scale = scrollY.interpolate({
                                        inputRange,
                                        outputRange: [0.8, 0.9, 1.1, 0.9, 0.8],
                                        extrapolate: 'clamp',
                                    });

                                    return (
                                        <Animated.View
                                            key={`${unit}-${item}`}
                                            style={[
                                                styles.statureItem,
                                                { height: ITEM_HEIGHT, opacity, transform: [{ scale }] }
                                            ]}
                                        >
                                            {unit === 'FT' ? (
                                                <Text style={styles.statureText}>
                                                    <Text style={styles.statureMainValue}>{Math.floor(item / 12)}</Text>
                                                    <Text style={styles.statureSubValue}>ft </Text>
                                                    <Text style={styles.statureMainValue}>{item % 12}</Text>
                                                    <Text style={styles.statureSubValue}>in</Text>
                                                </Text>
                                            ) : (
                                                <Text style={styles.statureText}>
                                                    <Text style={styles.statureMainValue}>{item}</Text>
                                                    <Text style={styles.statureSubValue}> cm</Text>
                                                </Text>
                                            )}
                                        </Animated.View>
                                    );
                                })}
                            </Animated.ScrollView>
                            <LinearGradient
                                colors={[COLORS.surface, 'transparent', 'transparent', COLORS.surface]}
                                locations={[0, 0.1, 0.9, 1]}
                                style={StyleSheet.absoluteFillObject}
                                pointerEvents="none"
                            />
                        </View>

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
                                fieldName="height"
                                isVisible={isVisible}
                                onClose={() => setInfoSheetOpen(false)}
                            />
                        )}
                    </View>
                </PremiumScreenWrapper>
            </ScrollView>
            <View style={sharedStyles.footer}>
                <View style={{ flex: 1 }} />
                <FAB
                    onPress={handleNext}
                    accessibilityLabel="Continue to next step"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    skipContainer: {
        flexShrink: 0,
    },
    skipButtonText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 13,
        color: '#9CA3AF',
        letterSpacing: 1.5,
    },
    unitToggleRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    arrowButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unitLabels: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    unitText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
        color: '#D1D5DB',
    },
    unitTextActive: {
        color: COLORS.black,
    },
    unitDivider: {
        marginHorizontal: SPACING.sm,
        color: '#D1D5DB',
        fontSize: 16,
    },
    staturePickerHero: {
        height: 380,
        width: '100%',
        position: 'relative',
        backgroundColor: COLORS.surface,
        borderRadius: 24,
        overflow: 'hidden',
    },
    pickerSelectionRing: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: 80,
        marginTop: -40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: COLORS.black,
        backgroundColor: 'rgba(0,0,0,0.02)',
        zIndex: 2,
    },
    statureItem: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statureText: {
        textAlign: 'center',
    },
    statureMainValue: {
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 32,
        color: COLORS.text,
    },
    statureSubValue: {
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
        color: COLORS.gray,
        textTransform: 'uppercase',
    },
});

export default HeightScreen;
