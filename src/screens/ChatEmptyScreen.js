import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Dimensions,
    StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
    cream: '#F5F2EB',
    cobaltBlue: '#1A1AFF',
    bauhausRed: '#E03A2F',
    black: '#000000',
};

const ChatEmptyScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* BACKGROUND DECORATIONS */}
            <View style={styles.decorContainer} pointerEvents="none">
                <Text style={[styles.driftText, { top: insets.top + 20, left: -20 }]}>
                    MESSAGES · CHAT · ALIGN · CONNECTION
                </Text>
                <Text style={[styles.driftText, { bottom: 180, right: -40 }]}>
                    CONNECTION · ALIGN · CHAT · MESSAGES
                </Text>
            </View>

            {/* Red Accent Dot */}
            <View style={[styles.accentDot, { top: insets.top + 20 }]} />

            {/* MAIN CONTENT AREA */}
            <View style={styles.main}>
                {/* Central Cobalt Circle */}
                <View style={styles.cobaltCircle} />

                {/* Typography Overlay */}
                <View style={styles.heroContent}>
                    <Text style={styles.massiveTitle}>SILENCE.</Text>
                    <Text style={styles.subtext}>
                        Your connections will appear here once you've aligned.
                    </Text>
                </View>
            </View>

            {/* FIXED FOOTER */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
                <Pressable
                    onPress={() => navigation.navigate('Home')}
                    style={({ pressed }) => [
                        styles.ctaButton,
                        pressed && styles.ctaButtonPressed
                    ]}
                >
                    <Text style={styles.ctaButtonText}>START DISCOVERING</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cream,
    },
    decorContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    driftText: {
        position: 'absolute',
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.black,
        opacity: 0.08,
        letterSpacing: 2.8, // 0.2em
        textTransform: 'uppercase',
    },
    accentDot: {
        position: 'absolute',
        left: 32,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: COLORS.bauhausRed,
        zIndex: 10,
    },
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    cobaltCircle: {
        position: 'absolute',
        width: 340,
        height: 340,
        borderRadius: 170,
        borderWidth: 12,
        borderColor: COLORS.cobaltBlue,
        zIndex: 0,
    },
    heroContent: {
        width: '100%',
        paddingHorizontal: 24,
        zIndex: 10,
        transform: [{ translateY: -20 }],
    },
    massiveTitle: {
        fontSize: 110, // Adjusted for mobile screen width
        fontFamily: 'Inter_900Black', // Using available Inter if Space Grotesk isn't loaded
        fontWeight: '900',
        color: COLORS.black,
        lineHeight: 100,
        letterSpacing: -5,
        marginLeft: -10,
    },
    subtext: {
        fontSize: 18,
        fontWeight: '300',
        color: COLORS.black,
        lineHeight: 24,
        marginTop: 32,
        maxWidth: 200,
    },
    footer: {
        paddingHorizontal: 24,
        zIndex: 20,
    },
    ctaButton: {
        backgroundColor: COLORS.black,
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ctaButtonPressed: {
        backgroundColor: COLORS.cobaltBlue,
    },
    ctaButtonText: {
        color: COLORS.cream,
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 2.8, // 0.2em
    },
});

export default ChatEmptyScreen;
