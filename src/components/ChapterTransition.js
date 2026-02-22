import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import COLORS from '../constants/colors';

/**
 * ChapterTransition
 * Full-screen overlay that fades in, holds briefly, then fades out
 * whenever the chapter name changes.
 *
 * Props:
 *   chapterName  {string}  — current chapter label (e.g. "Chapter 2: Your Life")
 *
 * The overlay sits at zIndex 999 / position absolute so it overlays
 * whatever screen is mounting below it, without blocking navigation.
 */
const ChapterTransition = ({ chapterName }) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const [visible, setVisible] = useState(false);
    const [displayName, setDisplayName] = useState(chapterName);
    // Track whether this is the very first render so we skip the initial chapter
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (!chapterName) return;

        // Capture the new name while animating
        setDisplayName(chapterName);
        setVisible(true);

        // fade in 150ms → hold 200ms → fade out 150ms
        Animated.sequence([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.delay(200),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start(() => setVisible(false));
    }, [chapterName]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.overlay, { opacity }]} pointerEvents="none">
            <Text style={styles.chapterText}>{displayName}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 999,
        backgroundColor: COLORS.black,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chapterText: {
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 28,
        color: COLORS.white,
        textAlign: 'center',
        letterSpacing: -0.5,
        paddingHorizontal: 32,
    },
});

export default ChapterTransition;
