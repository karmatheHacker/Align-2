import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HOME_COLORS } from '../constants/homeColors';

const MatchCard = ({ rank, name, score, initials, tagline, onViewPress }) => {
    return (
        <View style={styles.card}>
            {/* DEMO Badge */}
            <View style={styles.demoBadge}>
                <Text style={styles.demoText}>DEMO</Text>
            </View>

            {/* Row 1: Label + Initials */}
            <View style={styles.headerRow}>
                <Text style={styles.rankLabel}>
                    {rank === 'top' ? 'TOP ALIGNMENT' : 'RUNNER UP'}
                </Text>
                <View style={styles.initialsPill}>
                    <Text style={styles.initialsText}>{initials}</Text>
                </View>
            </View>

            {/* Row 2: Name */}
            <Text
                style={styles.nameText}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.6}
                maxFontSizeMultiplier={1.0}
            >
                {name}
            </Text>

            {/* Row 3: Score Bar */}
            <View style={styles.scoreRow}>
                <View style={styles.scoreBarBackground}>
                    <View style={[styles.scoreBarFill, { width: `${score}%` }]} />
                </View>
                <Text style={styles.scoreLabel}>{score}%</Text>
            </View>

            {/* Row 4: Tagline (Optional) */}
            {tagline && (
                <Text style={styles.taglineText} numberOfLines={2}>
                    {tagline}
                </Text>
            )}

            {/* Row 5: View Profile Button */}
            <TouchableOpacity
                style={styles.profileButton}
                onPress={onViewPress}
                activeOpacity={0.7}
            >
                <Text style={styles.buttonText}>VIEW PROFILE →</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: HOME_COLORS.card,
        borderRadius: 24,
        padding: 24,
        marginBottom: 12,
        overflow: 'hidden',
    },
    demoBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: HOME_COLORS.accent,
        borderBottomLeftRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
        zIndex: 1,
    },
    demoText: {
        fontSize: 9,
        fontWeight: '800',
        color: HOME_COLORS.white,
        letterSpacing: 1.5,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rankLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: HOME_COLORS.textMuted,
        letterSpacing: 3,
        textTransform: 'uppercase',
    },
    initialsPill: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    initialsText: {
        fontSize: 13,
        fontWeight: '800',
        color: HOME_COLORS.white,
    },
    nameText: {
        marginTop: 12,
        fontSize: 56,
        fontWeight: '900',
        color: HOME_COLORS.white,
        letterSpacing: -2,
        lineHeight: 54,
    },
    scoreRow: {
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    scoreBarBackground: {
        flex: 1,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    scoreBarFill: {
        height: 4,
        backgroundColor: HOME_COLORS.white,
        borderRadius: 2,
    },
    scoreLabel: {
        fontSize: 22,
        fontWeight: '900',
        color: HOME_COLORS.white,
        letterSpacing: -0.5,
        minWidth: 52,
    },
    taglineText: {
        marginTop: 10,
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
        lineHeight: 19,
    },
    profileButton: {
        marginTop: 16,
        width: '100%',
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 12,
        fontWeight: '700',
        color: HOME_COLORS.white,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
});

export default MatchCard;
