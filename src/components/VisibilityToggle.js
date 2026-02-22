import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import PropTypes from 'prop-types';
import COLORS from '../constants/colors';

const triggerLight = async () => {
    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch (_) { }
};

const VisibilityToggle = ({ isVisible, onToggle, activeColor = COLORS.black, label, style }) => {
    const displayLabel = isVisible ? (label || "Visible on profile") : "Hidden on profile";
    const iconName = isVisible ? "eye" : "eye-off";
    const contrastColor = isVisible ? activeColor : '#555555';

    return (
        <TouchableOpacity
            style={[styles.visibilityToggleRow, style]}
            onPress={() => { triggerLight(); onToggle(); }}
            activeOpacity={0.7}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isVisible }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
            <View style={styles.visibilityLabelGroup}>
                <Feather name={iconName} size={20} color={contrastColor} />
                <Text style={[styles.visibilityText, !isVisible && { color: '#555555' }]}>
                    {displayLabel}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    visibilityToggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 48,
        marginHorizontal: -8,
    },
    visibilityLabelGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    visibilityText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
        color: '#374151',
    },
});

VisibilityToggle.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    activeColor: PropTypes.string,
};

export default VisibilityToggle;
