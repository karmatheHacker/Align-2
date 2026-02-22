import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

/**
 * Three-layer staggered entrance animation.
 * title fires at 0ms, content at 80ms, footer at 160ms.
 * Each: translateY 16→0, opacity 0→1, 280ms ease-out.
 *
 * Safety guarantees:
 *   1. All Animated.Values start at 1 (fully visible, no offset).
 *   2. If animate=false (default), useEffect is a no-op — the INITIAL
 *      values (1) are used as-is. No transform or opacity issues.
 *   3. If animate=true, values reset to 0 before the animation fires.
 *      snapToVisible() is called both on completion AND in cleanup,
 *      so content is never permanently stuck hidden.
 *
 * @param {boolean} animate - Set true to run the entrance animation.
 *                            Defaults to false (safe, always visible).
 */
const useEntranceAnimation = (animate = false) => {
    // All values INITIALISED to 1 (fully visible, zero offset)
    const titleTranslate = useRef(new Animated.Value(1)).current;
    const contentTranslate = useRef(new Animated.Value(1)).current;
    const footerTranslate = useRef(new Animated.Value(1)).current;

    const titleOpacity = useRef(new Animated.Value(1)).current;
    const contentOpacity = useRef(new Animated.Value(1)).current;
    const footerOpacity = useRef(new Animated.Value(1)).current;

    const snapToVisible = () => {
        titleTranslate.setValue(1);
        contentTranslate.setValue(1);
        footerTranslate.setValue(1);
        titleOpacity.setValue(1);
        contentOpacity.setValue(1);
        footerOpacity.setValue(1);
    };

    useEffect(() => {
        if (!animate) {
            // Values are already at 1 from initialisation — nothing to do.
            // Call snapToVisible() to be explicit in case of hot reload.
            snapToVisible();
            return;
        }

        // Reset to hidden/offset before animating in
        titleTranslate.setValue(0);
        contentTranslate.setValue(0);
        footerTranslate.setValue(0);
        titleOpacity.setValue(0);
        contentOpacity.setValue(0);
        footerOpacity.setValue(0);

        const makeSequence = (translateRef, opacityRef, delay) =>
            Animated.sequence([
                Animated.delay(delay),
                Animated.parallel([
                    Animated.timing(translateRef, {
                        toValue: 1,
                        duration: 280,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityRef, {
                        toValue: 1,
                        duration: 280,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                ]),
            ]);

        const animation = Animated.parallel([
            makeSequence(titleTranslate, titleOpacity, 0),
            makeSequence(contentTranslate, contentOpacity, 80),
            makeSequence(footerTranslate, footerOpacity, 160),
        ]);

        // snap on completion regardless of whether it finished normally
        animation.start(() => snapToVisible());

        return () => {
            animation.stop();
            snapToVisible();
        };
    }, [animate]);

    /**
     * Build a style object for an animated layer.
     * When animate=false the values are always 1, producing:
     *   opacity: 1  →  fully visible
     *   translateY: 0  →  no offset (outputRange[1])
     */
    const makeStyle = (translateRef, opacityRef) => ({
        opacity: opacityRef,
        transform: [{
            translateY: translateRef.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0],   // 1 → 0px (final position)
                extrapolate: 'clamp',   // prevent overshoot on hot reload
            }),
        }],
    });

    return {
        titleStyle: makeStyle(titleTranslate, titleOpacity),
        contentStyle: makeStyle(contentTranslate, contentOpacity),
        footerStyle: makeStyle(footerTranslate, footerOpacity),
    };
};

export default useEntranceAnimation;
