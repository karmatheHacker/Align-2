import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import SPACING from '../constants/spacing';

const sharedStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.surface,
    },
    screenContainer: {
        flex: 1,
        backgroundColor: COLORS.surface,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SPACING.xl,
        backgroundColor: COLORS.surface,
    },
    scrollView: {
        flex: 1,
        backgroundColor: COLORS.surface,
    },
    header: {
        paddingTop: SPACING.lg, // 24px per Task 3 (Top -> StepIndicator top)
        paddingHorizontal: SPACING.xl, // 32px per Task 2
        marginBottom: 0, // Will be handled by row spacing
        alignItems: 'center',
    },
    content: {
        paddingTop: 0, // Gaps handled by margins
    },
    title: {
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 32,
        color: COLORS.text,
        marginBottom: SPACING.sm, // 8px per Task 3 (Title -> Subtitle)
        letterSpacing: -0.8,
        lineHeight: 42,
    },
    bodyText: {
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
        color: COLORS.gray, // m-4: was '#6B7280' (Tailwind), now design system token
        lineHeight: 24,
        marginBottom: SPACING.lg, // 24px per Task 3 (Body -> First option)
    },
    footer: {
        paddingHorizontal: SPACING.xl, // 32px per Task 2
        paddingBottom: SPACING.xxl, // 48px per Task 2
        flexDirection: 'row',
        alignItems: 'center', // Changed from flex-end for better alignment with toggle
        justifyContent: 'space-between',
    },
    pillButton: {
        backgroundColor: COLORS.black,
        borderRadius: 30,
        height: 58,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm, // Fixed from 10 to 8
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 2,
    },
    primaryButton: {
        backgroundColor: COLORS.black,
        borderRadius: 30,
        height: 58,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm, // Fixed from 10 to 8
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 2,
    },
    pillButtonText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
        color: COLORS.white,
    },
    fab: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: COLORS.black,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    visibilityToggleRowStandalone: {
        marginTop: SPACING.sm, // Fixed from 10 to 8
        marginBottom: SPACING.md, // Fixed from 20 to 16
    },
    intentionList: {
        marginTop: SPACING.sm, // Fixed from 10 to 8
    },
    intentionOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20, // Will be overridden by OptionRow defaults
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    skipButtonText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 13,
        color: '#9CA3AF',
        letterSpacing: 1.5,
    },
    underlinedInputContainer: {
        borderBottomWidth: 2,
        borderBottomColor: COLORS.black,
        marginBottom: SPACING.lg, // 24px
    },
    chapterLabel: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 11,
        color: '#9CA3AF',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginBottom: 0, // Reset to 0 as it's in a row now
    },
    progressRow: {
        marginTop: SPACING.xs, // 4px
        marginBottom: SPACING.sm, // 8px
    },
    progressTrack: {
        height: 2,
        backgroundColor: '#E5E7EB',
        borderRadius: 1,
        overflow: 'hidden',
    },
    progressFill: {
        height: 2,
        backgroundColor: COLORS.black,
        borderRadius: 1,
    },
    footerHelperText: {
        fontFamily: 'Inter_400Regular',
        fontSize: 13,
        color: '#9CA3AF',
        flex: 1,
        paddingRight: SPACING.md, // 16px
        lineHeight: 18,
    },
});

export default sharedStyles;

