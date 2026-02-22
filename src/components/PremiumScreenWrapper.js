import React from 'react';
import { View, Animated, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import useEntranceAnimation from '../hooks/useEntranceAnimation';
import useKeyboardOffset from '../hooks/useKeyboardOffset';

/**
 * PremiumScreenWrapper
 *
 * Wraps screen content with an optional staggered entrance animation.
 *
 * Props:
 *   animateEntrance {boolean} - Set true to run the slide-up/fade-in entrance
 *                               animation. Defaults to false — content renders
 *                               immediately at full opacity with zero transform.
 *
 * Usage — bare children (backward-compatible):
 *   <PremiumScreenWrapper>
 *     <View style={sharedStyles.content}>...</View>
 *   </PremiumScreenWrapper>
 *
 * Usage — named slots (full stagger + keyboard dodge):
 *   <PremiumScreenWrapper
 *     animateEntrance
 *     title={<Text>Title</Text>}
 *     content={<OptionList />}
 *     footer={<FAB />}
 *   />
 *
 * Architecture note:
 *   When animateEntrance=false (default) ALL Animated.Values are at their
 *   final state (opacity=1, translateY=0) before the first render. The
 *   Animated.View still participates in normal Yoga layout because we do NOT
 *   apply any collapsed/zero-height style.
 */
const PremiumScreenWrapper = ({
    title,
    content,
    footer,
    children,
    animateEntrance = false,
}) => {
    const { titleStyle, contentStyle, footerStyle } = useEntranceAnimation(animateEntrance);
    const keyboardOffset = useKeyboardOffset();

    // Backward-compatible: no named slots → wrap everything in contentStyle
    if (!title && !content && !footer) {
        return (
            <Animated.View style={[styles.wrapper, contentStyle]}>
                {children}
            </Animated.View>
        );
    }

    // Footer paddingBottom tracks keyboard height on iOS.
    // Android uses adjustResize (see app.json android.softwareKeyboardLayoutMode).
    const footerPadding = Platform.OS === 'ios'
        ? { paddingBottom: keyboardOffset }
        : undefined;

    return (
        <Animated.View style={styles.wrapper}>
            {title && (
                <Animated.View style={titleStyle}>
                    {title}
                </Animated.View>
            )}
            {content && (
                <Animated.View style={[styles.contentSlot, contentStyle]}>
                    {content}
                </Animated.View>
            )}
            {footer && (
                <Animated.View style={footerStyle}>
                    <Animated.View style={footerPadding}>
                        {footer}
                    </Animated.View>
                </Animated.View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        // No flex:1 — content expands naturally inside ScrollViews
        // No height — allows Yoga to size from children
    },
    contentSlot: {
        // No flex:1 — allows natural height expansion inside ScrollViews
    },
});

PremiumScreenWrapper.propTypes = {
    children: PropTypes.node,
    title: PropTypes.node,
    content: PropTypes.node,
    footer: PropTypes.node,
    animateEntrance: PropTypes.bool,
};

export default PremiumScreenWrapper;
