import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, Animated, Easing, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Feather } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { STEP_ORDER, STEP_CONFIG } from '../constants/steps';
import sharedStyles from '../styles/shared';

/**
 * StepIndicatorItem
 * Renders one icon circle in the step scroll row.
 *
 * States:
 *   isActive    — scales to 1.4, shows ripple ring loop, opacity 1
 *   isCompleted — opacity 1, shows a Feather "check" in place of the icon
 *   inactive    — opacity 0.25, no animation
 */
const StepIndicatorItem = ({ step, isActive, isCompleted }) => {
    // Active scale: 1.0 → 1.4 when becoming active
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(isCompleted ? 1 : (isActive ? 1 : 0.25))).current;

    // Ripple ring
    const rippleScale = useRef(new Animated.Value(1)).current;
    const rippleOpacity = useRef(new Animated.Value(0)).current;
    const rippleRef = useRef(null);

    const startRipple = () => {
        rippleScale.setValue(1);
        rippleOpacity.setValue(0.4);
        rippleRef.current = Animated.loop(
            Animated.parallel([
                Animated.timing(rippleScale, {
                    toValue: 2.0,
                    duration: 800,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(rippleOpacity, {
                    toValue: 0,
                    duration: 800,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );
        rippleRef.current.start();
    };

    const stopRipple = () => {
        if (rippleRef.current) {
            rippleRef.current.stop();
            rippleRef.current = null;
        }
        rippleScale.setValue(1);
        rippleOpacity.setValue(0);
    };

    useEffect(() => {
        if (isActive) {
            // Scale up to 1.4
            Animated.spring(scaleAnim, {
                toValue: 1.4,
                useNativeDriver: true,
                speed: 20,
                bounciness: 4,
            }).start();
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
            startRipple();
        } else {
            stopRipple();
            // Scale back down
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                speed: 20,
                bounciness: 0,
            }).start();
            Animated.timing(opacityAnim, {
                toValue: isCompleted ? 1 : 0.25,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
        return () => stopRipple();
    }, [isActive, isCompleted]);

    return (
        <View style={styles.itemWrapper}>
            {/* Ripple ring — behind the icon circle */}
            <Animated.View
                style={[
                    styles.rippleRing,
                    {
                        transform: [{ scale: rippleScale }],
                        opacity: rippleOpacity,
                    },
                ]}
                pointerEvents="none"
            />

            {/* Icon circle */}
            <Animated.View
                accessible={false}
                style={[
                    styles.iconCircle,
                    isActive && styles.iconCircleActive,
                    isCompleted && !isActive && styles.iconCircleCompleted,
                    {
                        opacity: opacityAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                {isCompleted && !isActive ? (
                    <Feather name="check" size={10} color={COLORS.black} />
                ) : (
                    <View style={isActive ? styles.activeDot : styles.inactiveDot} />
                )}
            </Animated.View>
        </View>
    );
};

StepIndicatorItem.propTypes = {
    step: PropTypes.object.isRequired,
    isActive: PropTypes.bool.isRequired,
    isCompleted: PropTypes.bool.isRequired,
};

// ---------------------------------------------------------------------------

const StepIndicator = ({ currentIndex, totalSteps }) => {
    const currentStepId = STEP_ORDER[currentIndex];

    // Animated progress bar — ratio 0..1, drives width %
    const progressRatio = useRef(
        new Animated.Value((currentIndex + 1) / totalSteps)
    ).current;

    useEffect(() => {
        Animated.timing(progressRatio, {
            toValue: (currentIndex + 1) / totalSteps,
            duration: 400,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();
    }, [currentIndex]);

    const animatedWidth = progressRatio.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    const getChapterData = (idx) => {
        if (idx <= 5) return { name: 'ABOUT YOU', current: idx + 1, total: 6 };
        if (idx <= 15) return { name: 'YOUR LIFE', current: idx - 5, total: 10 };
        return { name: 'YOUR PHOTOS', current: idx - 15, total: 2 };
    };

    const chapter = getChapterData(currentIndex);
    const chapterLabel = `${chapter.name} · STEP ${chapter.current} OF ${chapter.total}`;

    return (
        <View style={sharedStyles.stepIndicatorArea}>
            <Text style={sharedStyles.chapterLabel}>{chapterLabel}</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingRight: 20 }}
                style={styles.stepIconScroll}
            >
                {STEP_CONFIG.map((step, idx) => {
                    const stepIdx = STEP_ORDER.indexOf(step.id);
                    return (
                        <StepIndicatorItem
                            key={step.id}
                            step={step}
                            isActive={currentStepId === step.id}
                            isCompleted={stepIdx < currentIndex}
                        />
                    );
                })}
            </ScrollView>
            <View style={sharedStyles.progressRow}>
                <View style={sharedStyles.progressTrack}>
                    <Animated.View
                        testID="progress-fill"
                        style={[sharedStyles.progressFill, { width: animatedWidth }]}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    stepIconScroll: {
        marginBottom: 16,
    },
    itemWrapper: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rippleRing: {
        position: 'absolute',
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: COLORS.black,
    },
    iconCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    iconCircleActive: {
        // no extra visual — the activeDot + ripple communicate state
    },
    iconCircleCompleted: {
        backgroundColor: '#F3F4F6',
        borderWidth: 1.5,
        borderColor: '#D1D5DB',
    },
    activeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.black,
    },
    inactiveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#9CA3AF',
    },
});

StepIndicator.propTypes = {
    currentIndex: PropTypes.number.isRequired,
    totalSteps: PropTypes.number.isRequired,
};

export default StepIndicator;
