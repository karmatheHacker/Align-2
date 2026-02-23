import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import SPACING from '../constants/spacing';
import COLORS from '../constants/colors';
import { calculateAge, getBirthDateString } from '../utils/dateHelpers';

const AgeConfirmationModal = ({ visible, digits, ageError, onEdit, onConfirm }) => {
    const age = calculateAge(digits);
    const birthDateStr = getBirthDateString(digits);

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>You’re {age}</Text>
                        <Text style={styles.modalBirthDate}>{birthDateStr}</Text>
                        <Text style={styles.modalBody}>
                            Confirm your age is correct. Let’s keep our community authentic.
                        </Text>
                    </View>
                    {!!ageError && (
                        <Text style={styles.modalError}>{ageError}</Text>
                    )}

                    <View style={styles.modalActionRow}>
                        <TouchableOpacity style={styles.modalButton} onPress={onEdit}>
                            <Text style={styles.modalButtonTextEdit}>Edit</Text>
                        </TouchableOpacity>
                        <View style={styles.modalDivider} />
                        <TouchableOpacity style={[styles.modalButton, !!ageError && { opacity: 0.4 }]} onPress={onConfirm} disabled={!!ageError}>
                            <Text style={styles.modalButtonTextConfirm}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
    },
    modalContainer: {
        width: '100%',
        backgroundColor: COLORS.white,
        borderRadius: 24,
        overflow: 'hidden',
    },
    modalContent: {
        padding: SPACING.xl,
        alignItems: 'center',
    },
    modalTitle: {
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 32,
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    modalBirthDate: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
        color: COLORS.gray,
        marginBottom: SPACING.lg,
    },
    modalBody: {
        fontFamily: 'Inter_400Regular',
        fontSize: 15,
        color: COLORS.text,
        textAlign: 'center',
        lineHeight: 22,
    },
    modalError: {
        color: '#EF4444',
        fontFamily: 'Inter_500Medium',
        fontSize: 13,
        textAlign: 'center',
        paddingHorizontal: 32,
        marginBottom: 24,
    },
    modalActionRow: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    modalButton: {
        flex: 1,
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalDivider: {
        width: 1,
        backgroundColor: '#F3F4F6',
    },
    modalButtonTextEdit: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
        color: COLORS.gray,
    },
    modalButtonTextConfirm: {
        fontFamily: 'Inter_700Bold',
        fontSize: 16,
        color: COLORS.black,
    },
});

AgeConfirmationModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    digits: PropTypes.arrayOf(PropTypes.string).isRequired,
    ageError: PropTypes.string,
    onEdit: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
};

export default AgeConfirmationModal;
