import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, Animated, Easing, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { STEP_ORDER } from '../constants/steps';
import { STEP_ICONS } from '../constants/stepIcons';
import sharedStyles from '../styles/shared';
import BackButton from './BackButton';
import SPACING from '../constants/spacing';
import { Dimensions, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * AnimatedStepNode
 * Renders one step indicator node (future, active, or completed).
 */
const AnimatedStepNode = ({ stepKey, status, onLayout }) => {
    const prevStatus = useRef(status);

    // Animated values for layout
    const pillWidth = useRef(new Animated.Value(status === 'active' ? 44 : (status === 'completed' ? 28 : 8))).current;
    const pillHeight = useRef(new Animated.Value(status === 'active' ? 44 : (status === 'completed' ? 28 : 8))).current;
    const borderRadius = useRef(new Animated.Value(status === 'active' ? 22 : (status === 'completed' ? 14 : 4))).current;

    // Animated values for visual state
    const bgScale = useRef(new Animated.Value(status === 'future' ? 0 : 1)).current; // 0: lightGray, 1: black
    const iconOpacity = useRef(new Animated.Value(status === 'active' ? 1 : 0)).current;
    const checkOpacity = useRef(new Animated.Value(status === 'completed' ? 1 : 0)).current;

    // Ripple ring loop for active state
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
        if (rippleRef.current) rippleRef.current.stop();
        rippleScale.setValue(1);
        rippleOpacity.setValue(0);
    };

    useEffect(() => {
        if (status === 'active') startRipple();
        else stopRipple();
        return () => stopRipple();
    }, [status]);

    useEffect(() => {
        if (prevStatus.current === status) return;

        const config = {
            active: { w: 44, h: 44, r: 22 },
            completed: { w: 28, h: 28, r: 14 },
            future: { w: 8, h: 8, r: 4 }
        };

        const target = config[status];

        // Transition Logic
        if (prevStatus.current === 'active' && status === 'completed') {
            // Forward: Active -> Completed
            Animated.sequence([
                Animated.timing(iconOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
                Animated.parallel([
                    Animated.spring(pillWidth, { toValue: target.w, tension: 100, friction: 10, useNativeDriver: false }),
                    Animated.spring(pillHeight, { toValue: target.h, tension: 100, friction: 10, useNativeDriver: false }),
                    Animated.spring(borderRadius, { toValue: target.r, tension: 100, friction: 10, useNativeDriver: false }),
                ]),
                Animated.timing(checkOpacity, { toValue: 1, duration: 100, useNativeDriver: true })
            ]).start();
        } else if (prevStatus.current === 'future' && status === 'active') {
            // Forward: Future -> Active
            Animated.sequence([
                Animated.delay(350),
                Animated.parallel([
                    Animated.spring(pillWidth, { toValue: target.w, tension: 120, friction: 8, useNativeDriver: false }),
                    Animated.spring(pillHeight, { toValue: target.h, tension: 120, friction: 8, useNativeDriver: false }),
                    Animated.spring(borderRadius, { toValue: target.r, tension: 120, friction: 8, useNativeDriver: false }),
                    Animated.timing(bgScale, { toValue: 1, duration: 250, useNativeDriver: true }),
                ]),
                Animated.timing(iconOpacity, { toValue: 1, duration: 150, useNativeDriver: true })
            ]).start();
        } else if (prevStatus.current === 'active' && status === 'future') {
            // Backward: Active -> Future
            Animated.sequence([
                Animated.timing(iconOpacity, { toValue: 0, duration: 100, useNativeDriver: true }),
                Animated.parallel([
                    Animated.spring(pillWidth, { toValue: target.w, tension: 120, friction: 8, useNativeDriver: false }),
                    Animated.spring(pillHeight, { toValue: target.h, tension: 120, friction: 8, useNativeDriver: false }),
                    Animated.spring(borderRadius, { toValue: target.r, tension: 120, friction: 8, useNativeDriver: false }),
                    Animated.timing(bgScale, { toValue: 0, duration: 200, useNativeDriver: true }),
                ])
            ]).start();
        } else if (prevStatus.current === 'completed' && status === 'active') {
            // Backward: Completed -> Active
            Animated.sequence([
                Animated.delay(300),
                Animated.parallel([
                    Animated.spring(pillWidth, { toValue: target.w, tension: 100, friction: 10, useNativeDriver: false }),
                    Animated.spring(pillHeight, { toValue: target.h, tension: 100, friction: 10, useNativeDriver: false }),
                    Animated.spring(borderRadius, { toValue: target.r, tension: 100, friction: 10, useNativeDriver: false }),
                ]),
                Animated.parallel([
                    Animated.timing(checkOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
                    Animated.timing(iconOpacity, { toValue: 1, duration: 150, useNativeDriver: true })
                ])
            ]).start();
        }

        prevStatus.current = status;
    }, [status]);

    const iconData = STEP_ICONS[stepKey];
    const IconComponent = iconData?.lib === 'MaterialIcons' ? MaterialIcons : Feather;

    return (
        <View onLayout={onLayout} style={styles.nodeContainer} testID={`step-node-${stepKey}`}>
            {status === 'active' && (
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
            )}
            <Animated.View style={[
                styles.nodePill,
                {
                    width: pillWidth,
                    height: pillHeight,
                    borderRadius: borderRadius,
                    backgroundColor: bgScale.interpolate({
                        inputRange: [0, 1],
                        outputRange: [COLORS.lightGray, COLORS.black]
                    })
                }
            ]}>
                {iconData && (
                    <Animated.View style={[StyleSheet.absoluteFill, styles.iconContainer, { opacity: iconOpacity }]}>
                        <IconComponent name={iconData.name} size={20} color={COLORS.white} />
                    </Animated.View>
                )}
                <Animated.View style={[StyleSheet.absoluteFill, styles.iconContainer, { opacity: checkOpacity }]}>
                    <Feather name="check" size={12} color={COLORS.white} />
                </Animated.View>
            </Animated.View>
        </View>
    );
};

AnimatedStepNode.propTypes = {
    stepKey: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['future', 'active', 'completed']).isRequired,
    onLayout: PropTypes.func,
};

// ---------------------------------------------------------------------------

const StepIndicator = ({ currentIndex, totalSteps, onBack, rightAction, backgroundColor }) => {
    const insets = useSafeAreaInsets();
    const currentStepId = STEP_ORDER[currentIndex];
    const scrollRef = useRef(null);
    const nodePositions = useRef([]).current;

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

        // Auto-scroll to active item
        if (nodePositions[currentIndex] !== undefined) {
            scrollRef.current?.scrollTo({
                x: Math.max(0, nodePositions[currentIndex] - SCREEN_WIDTH / 2 + 22),
                animated: true
            });
        }
    }, [currentIndex]);

    const statusBarHeight = insets.top > 0
        ? insets.top
        : Platform.OS === 'android'
            ? StatusBar.currentHeight || 24
            : 44;

    const animatedWidth = progressRatio.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    const getChapterData = (idx) => {
        if (idx <= 5) return { name: 'ABOUT YOU', current: idx + 1, total: 6 };
        if (idx <= 15) return { name: 'YOUR LIFE', current: idx - 5, total: 10 };
        return { name: 'YOUR PHOTOS', current: idx - 15, total: 4 };
    };

    const chapter = getChapterData(currentIndex);
    const chapterLabel = `${chapter.name} · STEP ${chapter.current} OF ${chapter.total}`;

    return (
        <View style={[
            styles.indicatorContainer,
            {
                paddingTop: statusBarHeight + 8,
                backgroundColor: backgroundColor || COLORS.surface
            }
        ]}>
            <View style={[styles.topRow, { paddingHorizontal: SPACING.xl }]}>
                <View style={styles.leftAction}>
                    {onBack && <BackButton onPress={onBack} />}
                </View>
                <Text style={[sharedStyles.chapterLabel, styles.chapterLabelText]} numberOfLines={1} ellipsizeMode="tail">
                    {chapterLabel}
                </Text>
                <View style={styles.rightAction}>
                    {rightAction}
                </View>
            </View>
            <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 6, paddingHorizontal: SPACING.xl, alignItems: 'center' }}
                style={styles.stepIconScroll}
            >
                {STEP_ORDER.map((stepKey, idx) => {
                    const status = idx === currentIndex ? 'active' : (idx < currentIndex ? 'completed' : 'future');
                    return (
                        <AnimatedStepNode
                            key={stepKey}
                            stepKey={stepKey}
                            status={status}
                            onLayout={(e) => { nodePositions[idx] = e.nativeEvent.layout.x; }}
                        />
                    );
                })}
            </ScrollView>
            <View style={[sharedStyles.progressRow, styles.progressRowFull]}>
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
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.md, // 16px
    },
    leftAction: {
        width: 44,
        alignItems: 'flex-start',
    },
    rightAction: {
        width: 44,
        alignItems: 'flex-end',
        flexShrink: 0,
    },
    stepIconScroll: {
        marginBottom: SPACING.md,
        height: 44,
    },
    nodeContainer: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    rippleRing: {
        position: 'absolute',
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: COLORS.black,
    },
    nodePill: {
        width: 44, // Default fallback
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    chapterLabelText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 10,
        height: 20,
        lineHeight: 20,
        overflow: 'hidden',
    },
    progressRowFull: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingHorizontal: 0,
        width: '100%',
    },
    indicatorContainer: {
        paddingHorizontal: 0,
        paddingBottom: SPACING.sm,
        marginBottom: SPACING.xl,
    },
});

StepIndicator.propTypes = {
    currentIndex: PropTypes.number.isRequired,
    totalSteps: PropTypes.number.isRequired,
    onBack: PropTypes.func,
    rightAction: PropTypes.node,
    backgroundColor: PropTypes.string,
};

export default StepIndicator;
