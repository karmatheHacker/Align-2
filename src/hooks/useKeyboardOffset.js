import { useEffect, useRef } from 'react';
import { Animated, Keyboard, Platform } from 'react-native';

/**
 * useKeyboardOffset
 *
 * Returns an Animated.Value that tracks the visible keyboard height.
 * When the keyboard rises, the value animates to the keyboard height.
 * When it hides, it animates back to 0.
 *
 * Use `useNativeDriver: false` in your consumer (width/layout props).
 *
 * On Android the system handles resizing when windowSoftInputMode is
 * adjustResize, so we only apply the offset on iOS.
 */
const useKeyboardOffset = () => {
    const offset = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const show = Keyboard.addListener(showEvent, (e) => {
            Animated.timing(offset, {
                toValue: e.endCoordinates.height,
                duration: Platform.OS === 'ios' ? (e.duration || 250) : 200,
                useNativeDriver: false,
            }).start();
        });

        const hide = Keyboard.addListener(hideEvent, (e) => {
            Animated.timing(offset, {
                toValue: 0,
                duration: Platform.OS === 'ios' ? (e.duration || 200) : 200,
                useNativeDriver: false,
            }).start();
        });

        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    return offset;
};

export default useKeyboardOffset;
