import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import COLORS from '../constants/colors';

const BackButton = ({ onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel="Go back to previous step"
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
        <MaterialIcons name="arrow-back" size={24} color={COLORS.black} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    backButton: {
        padding: 5,
    },
});

BackButton.propTypes = {
    onPress: PropTypes.func.isRequired,
};

export default BackButton;
