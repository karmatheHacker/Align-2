import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Pressable,
    Dimensions,
    Animated,
    StatusBar,
    Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const COLORS = {
    background: '#F5F0EB',
    ink: '#0D0D0D',
    accent: '#FF5C00',
    muted: '#999999',
    white: '#FFFFFF',
    border: 'rgba(0,0,0,0.08)',
};

const PHOTOS = [
    'https://picsum.photos/seed/priya1/800/1200',
    'https://picsum.photos/seed/priya2/800/1200',
    'https://picsum.photos/seed/priya3/800/1200',
    'https://picsum.photos/seed/priya4/800/1200',
    'https://picsum.photos/seed/priya5/800/1200',
    'https://picsum.photos/seed/priya6/800/1200',
];

const WAVEFORM_HEIGHTS = [
    12, 20, 8, 24, 16, 28, 10, 18, 14, 22, 9, 26, 11, 19, 15, 25, 8, 21, 13, 27, 10, 17, 23, 9, 20, 14, 24, 11
];

const ProfileViewScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playedBars, setPlayedBars] = useState(10); // Start with 10 as per v3 spec
    const playIntervalRef = useRef(null);

    // Carousel navigation
    const nextPhoto = () => {
        if (currentPhotoIndex < PHOTOS.length - 1) {
            setCurrentPhotoIndex(prev => prev + 1);
        }
    };

    const prevPhoto = () => {
        if (currentPhotoIndex > 0) {
            setCurrentPhotoIndex(prev => prev - 1);
        }
    };

    // Voice player logic
    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        if (isPlaying) {
            playIntervalRef.current = setInterval(() => {
                setPlayedBars(prev => {
                    if (prev < WAVEFORM_HEIGHTS.length) return prev + 1;
                    clearInterval(playIntervalRef.current);
                    setIsPlaying(false);
                    return 0; // Reset as per v3 waveform JS
                });
            }, 120); // Faster 120ms interval per v3 spec
        } else {
            clearInterval(playIntervalRef.current);
        }
        return () => clearInterval(playIntervalRef.current);
    }, [isPlaying]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* FLOATING HEADER */}
            <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
                <Pressable onPress={() => navigation.goBack()} style={styles.glassBtn}>
                    <Feather name="chevron-left" size={24} color={COLORS.white} />
                </Pressable>

                <View style={styles.headerRight}>
                    <View style={[styles.glassBtn, styles.counterBadge]}>
                        <Text style={styles.counterText}>{currentPhotoIndex + 1} / {PHOTOS.length}</Text>
                    </View>
                    <Pressable style={styles.glassBtn}>
                        <View style={styles.optionsDot} />
                        <View style={[styles.optionsDot, { marginVertical: 3 }]} />
                        <View style={styles.optionsDot} />
                    </Pressable>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* PHOTO CAROUSEL — 42vh tall */}
                <View style={styles.carouselContainer}>
                    <Image
                        source={{ uri: PHOTOS[currentPhotoIndex] }}
                        style={styles.mainPhoto}
                    />

                    {/* Tap Zones */}
                    <View style={styles.tapZones}>
                        <Pressable onPress={prevPhoto} style={styles.leftTapZone} />
                        <Pressable onPress={nextPhoto} style={styles.rightTapZone} />
                    </View>

                    {/* Gradient Overlay */}
                    <View style={styles.gradientOverlay} />

                    {/* Name & Age — Stacked on two lines */}
                    <View style={styles.photoOverlayContent}>
                        <Text style={styles.nameText}>Priya</Text>
                        <Text style={styles.ageText}>26</Text>
                    </View>

                    {/* Location — below age */}
                    <View style={styles.locationContainer}>
                        <Feather name="navigation" size={14} color="rgba(255,255,255,0.9)" />
                        <Text style={styles.locationLabel}>Bangalore, Karnataka</Text>
                    </View>

                    {/* Progress Dots */}
                    <View style={styles.dotsContainer}>
                        {PHOTOS.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.dot,
                                    { backgroundColor: i === currentPhotoIndex ? COLORS.white : 'rgba(255,255,255,0.4)' }
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* MAIN CONTENT AREA */}
                <View style={[styles.mainBody, { paddingBottom: insets.bottom + 12 }]}>

                    {/* AI MATCH CARD */}
                    <View style={styles.aiCard}>
                        <View style={styles.aiCardHeader}>
                            <View style={styles.matchBadge}>
                                <MaterialCommunityIcons name="lightning-bolt" size={12} color={COLORS.white} />
                                <Text style={styles.matchBadgeText}>94% MATCH</Text>
                            </View>
                            <Feather name="zap" size={18} color={COLORS.white} style={{ opacity: 0.4 }} />
                        </View>

                        <Text style={styles.aiHeadline}>Why you'd work</Text>
                        <Text style={styles.aiSummary}>
                            You both prioritise deep conversations over small talk, share a love
                            for architecture and minimalism, and have compatible long-term
                            intentions. Priya's private bio suggests emotional maturity that
                            aligns with your communication style.
                        </Text>

                        <View style={styles.aiFooter}>
                            <View style={styles.aiStatusDot} />
                            <Text style={styles.aiFooterText}>AI POWERED ANALYSIS</Text>
                        </View>
                    </View>

                    {/* VOICE PROMPT CARD */}
                    <View style={styles.card}>
                        <View style={styles.labelRow}>
                            <MaterialIcons name="mic" size={14} color={COLORS.accent} />
                            <Text style={styles.sectionLabel}>VOICE PROMPT</Text>
                        </View>
                        <Text style={styles.voicePromptText}>"My ideal Sunday morning looks like..."</Text>

                        <View style={styles.voicePlayerRow}>
                            <Pressable
                                onPress={togglePlay}
                                style={styles.playButton}
                            >
                                <Ionicons name={isPlaying ? "pause" : "play"} size={18} color={COLORS.white} />
                            </Pressable>

                            <View style={styles.waveformContainer}>
                                {WAVEFORM_HEIGHTS.map((h, i) => (
                                    <View
                                        key={i}
                                        style={[
                                            styles.waveformBar,
                                            {
                                                height: h,
                                                backgroundColor: i < playedBars ? COLORS.accent : 'rgba(13,13,13,0.15)'
                                            }
                                        ]}
                                    />
                                ))}
                            </View>

                            <Text style={styles.durationText}>0:42</Text>
                        </View>
                    </View>

                    {/* BIO CARD — Label + Text ONLY */}
                    <View style={styles.card}>
                        <View style={styles.labelRow}>
                            <Feather name="book-open" size={14} color={COLORS.ink} />
                            <Text style={styles.sectionLabel}>BIO</Text>
                        </View>
                        <Text style={styles.bioText}>
                            Architect by day, home cook by night. Looking for someone who can keep up with both.
                        </Text>
                    </View>

                    {/* IDENTITY GRID — 2x2 Grid */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>IDENTITY</Text>
                        <View style={styles.identityGrid}>
                            <IdentityPill icon={<Feather name="user" size={14} color={COLORS.ink} />} label="Woman" />
                            <IdentityPill icon={<Feather name="heart" size={14} color={COLORS.ink} />} label="Straight" />
                            <IdentityPill icon={<Feather name="flag" size={14} color={COLORS.ink} />} label="Life partner" />
                            <IdentityPill icon={<Feather name="link" size={14} color={COLORS.ink} />} label="Long-term" />
                        </View>
                    </View>

                    {/* LIFESTYLE GRID */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>LIFESTYLE</Text>
                        <View style={styles.lifestyleGrid}>
                            <LifestyleCard icon={<MaterialCommunityIcons name="ruler" size={20} color={COLORS.accent} />} label="HEIGHT" value="5ft 6in" />
                            <LifestyleCard icon={<MaterialCommunityIcons name="glass-wine" size={20} color={COLORS.accent} />} label="DRINKING" value="Socially" />
                            <LifestyleCard icon={<MaterialCommunityIcons name="weather-windy" size={20} color={COLORS.accent} />} label="TOBACCO" value="Never" />
                            <LifestyleCard icon={<Feather name="sun" size={20} color={COLORS.accent} />} label="RELIGION" value="Hindu" />
                            <LifestyleCard icon={<Feather name="users" size={20} color={COLORS.accent} />} label="CHILDREN" value="Open to it" />
                            <LifestyleCard icon={<Feather name="briefcase" size={20} color={COLORS.accent} />} label="WORKS AT" value="Razorpay" />
                        </View>
                    </View>

                    {/* BACKGROUND CARD */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>BACKGROUND</Text>
                        <View style={styles.backgroundCard}>
                            <BackgroundRow icon={<Feather name="map-pin" size={16} color={COLORS.muted} />} label="Hometown" value="Mysore, KA" isFirst />
                            <BackgroundRow icon={<Feather name="award" size={16} color={COLORS.muted} />} label="Education" value="Masters" />
                            <BackgroundRow icon={<Feather name="book" size={16} color={COLORS.muted} />} label="Works at" value="Razorpay" isLast />
                        </View>
                    </View>

                    {/* FOOTER BUTTONS — mb-6 equivalent */}
                    <View style={styles.footer}>
                        <Pressable style={styles.passButton}>
                            <Feather name="x" size={24} color={COLORS.muted} />
                        </Pressable>
                        <Pressable style={styles.sendButton}>
                            <Feather name="send" size={16} color={COLORS.white} />
                            <Text style={styles.sendButtonText}>SEND REQUEST</Text>
                        </Pressable>
                    </View>

                    <View style={{ height: 4 }} />
                </View>
            </ScrollView>
        </View>
    );
};

const IdentityPill = ({ icon, label }) => (
    <View style={styles.pill}>
        {icon}
        <Text numberOfLines={1} style={styles.pillText}>{label}</Text>
    </View>
);

const LifestyleCard = ({ icon, label, value }) => (
    <View style={styles.gridCard}>
        {icon}
        <Text style={styles.gridLabel}>{label}</Text>
        <Text style={styles.gridValue}>{value}</Text>
    </View>
);

const BackgroundRow = ({ icon, label, value, isFirst, isLast }) => (
    <View style={[
        styles.backgroundRow,
        isFirst && { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
        isLast && { borderBottomWidth: 0, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }
    ]}>
        <View style={styles.rowLabelContainer}>
            {icon}
            <Text style={styles.rowLabel}>{label}</Text>
        </View>
        <Text style={styles.rowValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    floatingHeader: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    glassBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    counterBadge: {
        width: 60,
    },
    counterText: {
        color: COLORS.white,
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 1,
    },
    optionsDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.white,
    },
    scrollContent: {
        flexGrow: 1,
    },
    carouselContainer: {
        width: '100%',
        height: SCREEN_HEIGHT * 0.42, // Exactly 42vh as per v3 spec
        backgroundColor: '#1a1a1a',
        position: 'relative',
    },
    mainPhoto: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    tapZones: {
        position: 'absolute',
        inset: 0,
        flexDirection: 'row',
        zIndex: 10,
    },
    leftTapZone: {
        flex: 0.4,
    },
    rightTapZone: {
        flex: 0.6,
    },
    gradientOverlay: {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.25)', // Lighter overlay for v3
    },
    // Progress dots sit flush at the bottom of the section
    photoOverlayContent: {
        position: 'absolute',
        bottom: 56, // above location row
        left: 20,
        zIndex: 20,
    },
    nameText: {
        color: COLORS.white,
        fontSize: 36, // per spec
        fontWeight: '700',
        letterSpacing: -0.5,
        lineHeight: 36,
    },
    ageText: {
        color: COLORS.white,
        fontSize: 28, // per spec
        fontWeight: '700',
        lineHeight: 28,
        marginTop: 4,
        opacity: 0.95,
    },
    locationContainer: {
        position: 'absolute',
        bottom: 20, // bottom-5 equivalent
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        zIndex: 20,
    },
    locationLabel: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
    },
    dotsContainer: {
        position: 'absolute',
        bottom: -20, // Sit flush below photo section
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        zIndex: 20,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    mainBody: {
        backgroundColor: COLORS.background,
        paddingHorizontal: 16,
        paddingTop: 24, // pt-6 equivalent
        gap: 16,
    },
    aiCard: {
        backgroundColor: COLORS.ink,
        borderRadius: 20,
        padding: 20,
    },
    aiCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    matchBadge: {
        backgroundColor: COLORS.accent,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    matchBadgeText: {
        color: COLORS.white,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.5,
    },
    aiHeadline: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '700',
        marginTop: 12,
        lineHeight: 24,
    },
    aiSummary: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 14,
        lineHeight: 22,
        marginTop: 8,
    },
    aiFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 16,
    },
    aiStatusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#22C55E',
    },
    aiFooterText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 2.5,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8, // mb-3 equivalent
    },
    sectionLabel: {
        color: COLORS.muted,
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 2,
    },
    voicePromptText: {
        fontSize: 13,
        fontStyle: 'italic',
        color: COLORS.muted,
        marginBottom: 16,
    },
    voicePlayerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    playButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.ink,
        alignItems: 'center',
        justifyContent: 'center',
    },
    waveformContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        height: 32,
    },
    waveformBar: {
        width: 3,
        borderRadius: 2,
    },
    durationText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.muted,
    },
    bioText: {
        fontSize: 15,
        lineHeight: 25,
        color: COLORS.ink,
    },
    sectionContainer: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.muted,
        letterSpacing: 2.5,
        marginLeft: 4,
    },
    identityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    pill: {
        backgroundColor: COLORS.white,
        width: (SCREEN_WIDTH - 32 - 8) / 2, // 2-column grid-like cells
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 30, // rounded-full
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    pillText: {
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.ink,
        flexShrink: 1,
    },
    lifestyleGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    gridCard: {
        backgroundColor: COLORS.white,
        width: (SCREEN_WIDTH - 32 - 8) / 2,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'flex-start',
    },
    gridLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: COLORS.muted,
        letterSpacing: 2,
        marginTop: 8,
    },
    gridValue: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.ink,
        marginTop: 2,
    },
    backgroundCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
    },
    backgroundRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    rowLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    rowLabel: {
        fontSize: 13,
        color: COLORS.muted,
    },
    rowValue: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.ink,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 20, // mt-5 equivalent
        marginBottom: 24, // mb-6 equivalent
    },
    passButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButton: {
        flex: 1,
        height: 56,
        backgroundColor: COLORS.ink,
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    sendButtonText: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 2.5,
    },
});

export default ProfileViewScreen;
