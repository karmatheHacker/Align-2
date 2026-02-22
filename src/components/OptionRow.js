import React, { memo, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import PropTypes from 'prop-types';
import COLORS from '../constants/colors';

const triggerLight = async () => {
    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch (_) { }
};

const OptionRow = memo(({
    label,
    description,
    selected,
    onPress,
    variant = 'radio',
    activeColor = COLORS.black,
    style,
    labelStyle
}) => {
    // ─── NATIVE-DRIVER animations: transform + opacity only ───────────────────
    // Scale pulse (press-in shrink + selection bounce)
    const scaleAnim = useRef(new Animated.Value(1)).current;
    // Radio/checkbox fill animation
    const selectionAnim = useRef(new Animated.Value(selected ? 1 : 0)).current;

    // ─── JS-DRIVER animations: shadow/elevation only ──────────────────────────
    // Completely isolated — never mixed with native-driver animations
    const shadowAnim = useRef(new Animated.Value(selected ? 1 : 0)).current;

    // ── selectionAnim: drives radio dot / checkbox scale+opacity (native) ─────
    useEffect(() => {
        Animated.timing(selectionAnim, {
            toValue: selected ? 1 : 0,
            duration: 250,
            easing: Easing.bezier(0.34, 1.56, 0.64, 1),
            useNativeDriver: true,  // safe: only transform + opacity
        }).start();
    }, [selected]);

    // ── scaleAnim: selection pulse (native) ───────────────────────────────────
    // Runs independently of shadowAnim — never in the same parallel/sequence
    useEffect(() => {
        if (selected) {
            Animated.sequence([
                Animated.spring(scaleAnim, {
                    toValue: 1.02,
                    useNativeDriver: true,  // safe: only transform
                    speed: 50,
                    bounciness: 6,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1.0,
                    useNativeDriver: true,
                    speed: 50,
                    bounciness: 0,
                }),
            ]).start();
        }
        // No reset on deselect — scale naturally returns to 1.0 via press-out
    }, [selected]);

    // ── shadowAnim: shadow/elevation (JS-driver only, fully isolated) ─────────
    // This is the ONLY place useNativeDriver:false is used.
    // It is never combined with scaleAnim or selectionAnim.
    useEffect(() => {
        Animated.timing(shadowAnim, {
            toValue: selected ? 1 : 0,
            duration: selected ? 200 : 150,
            useNativeDriver: false,  // required: shadow/elevation are layout props
        }).start();
    }, [selected]);

    // ── Press handlers: native-driver scale only ──────────────────────────────
    const handlePressIn = () => {
        Animated.timing(scaleAnim, {
            toValue: 0.98,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 120,
            useNativeDriver: true,
        }).start();
    };

    // ── Shadow interpolations driven by JS shadowAnim ─────────────────────────
    const shadowOpacity = shadowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.08],
    });
    const elevation = shadowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 3],
    });

    return (
        <TouchableOpacity
            onPress={() => { triggerLight(); onPress(); }}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
            accessibilityRole={variant === 'checkbox' ? 'checkbox' : 'radio'}
            accessibilityState={{
                checked: variant === 'checkbox' ? selected : undefined,
                selected: variant === 'radio' ? selected : undefined
            }}
            style={style}
        >
            {/*
              * Outer Animated.View: NATIVE driver — transform (scale) only.
              * Inner Animated.View: JS driver     — shadow/elevation only.
              * These two layers MUST remain separate. Never merge their styles.
              */}
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Animated.View
                    style={[
                        styles.selectableOptionRow,
                        selected && styles.selectableOptionRowSelected,
                        selected && { shadowColor: '#000' },
                        description && { paddingVertical: 20 },
                        { shadowOpacity, elevation },
                    ]}
                >
                    <View style={{ flex: 1, paddingRight: 10 }}>
                        <Text style={[styles.selectableOptionLabel, labelStyle, selected && { color: activeColor }]}>
                            {label}
                        </Text>
                        {description && (
                            <Text style={styles.optionDescription}>
                                {description.split('Learn more')[0]}
                                <Text style={{ color: activeColor, fontWeight: '600' }}>Learn more</Text>
                            </Text>
                        )}
                    </View>
                    {variant === 'radio' && (
                        <View style={[styles.radioCircle, selected && { borderColor: activeColor }]}>
                            <Animated.View
                                style={[
                                    styles.radioDot,
                                    {
                                        backgroundColor: activeColor,
                                        transform: [{ scale: selectionAnim }],
                                        opacity: selectionAnim
                                    }
                                ]}
                            />
                        </View>
                    )}
                    {variant === 'checkbox' && (
                        <View style={[styles.customCheckbox, selected && { backgroundColor: activeColor, borderColor: activeColor }]}>
                            {selected && (
                                <Animated.View style={{ transform: [{ scale: selectionAnim }] }}>
                                    <Feather name="check" size={16} color={COLORS.white} />
                                </Animated.View>
                            )}
                        </View>
                    )}
                </Animated.View>
            </Animated.View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    selectableOptionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 20,
        minHeight: 64,
        borderColor: 'transparent',
        borderRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
    },
    selectableOptionRowSelected: {
        backgroundColor: COLORS.white,
    },
    selectableOptionLabel: {
        fontFamily: 'Inter_500Medium',
        fontSize: 17,
        color: COLORS.text,
        letterSpacing: -0.2,
    },
    optionDescription: {
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
        color: '#6B7280',
        marginTop: 4,
        lineHeight: 22,
    },
    radioCircle: {
        width: 44,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.black,
    },
    customCheckbox: {
        width: 44,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
});

OptionRow.propTypes = {
    variant: PropTypes.oneOf(['radio', 'checkbox']),
    label: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    onPress: PropTypes.func.isRequired,
};

export default OptionRow;
