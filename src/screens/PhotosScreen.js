import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Animated, Alert, StyleSheet } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useOnboarding } from '../context/OnboardingContext';
import StepIndicator from '../components/StepIndicator';
import BackButton from '../components/BackButton';
import FAB from '../components/FAB';
import COLORS from '../constants/colors';
import { STEP_ORDER } from '../constants/steps';
import sharedStyles from '../styles/shared';

const ActionCircle = ({ iconName, iconSize = 24, color = COLORS.white, backgroundColor = COLORS.black, onPress, style, useFeather = false }) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[styles.actionCircle, { backgroundColor }, style]}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
        {useFeather ? (
            <Feather name={iconName} size={iconSize} color={color} />
        ) : (
            <MaterialIcons name={iconName} size={iconSize} color={color} />
        )}
    </TouchableOpacity>
);

const MediaSlotItem = ({ item, index, onAction }) => {
    const fadeAnim = useRef(new Animated.Value(item.type === 'image' ? 1 : 0.8)).current;
    const scaleAnim = useRef(new Animated.Value(item.type === 'image' ? 1 : 0.96)).current;

    useEffect(() => {
        if (item.type === 'image') {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [item.type]);

    const isPrimary = index === 0;

    return (
        <View style={[styles.mediaSlot, isPrimary && styles.mediaSlotPrimary]}>
            <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
                {item.type === 'image' ? (
                    <View style={styles.mediaSlotContent}>
                        <Image source={{ uri: item.uri }} style={styles.mediaImage} accessibilityLabel={`User uploaded photo ${index + 1}`} />
                        {isPrimary && (
                            <View style={styles.primaryBadge}>
                                <Text style={styles.primaryBadgeText}>PRIMARY</Text>
                            </View>
                        )}
                        <ActionCircle
                            iconName="edit"
                            iconSize={18}
                            color={COLORS.black}
                            backgroundColor={COLORS.white}
                            onPress={() => onAction('edit', item.id)}
                            style={styles.mediaActionPosition}
                        />
                    </View>
                ) : (
                    <View style={[styles.mediaDashedBorder, isPrimary && { borderColor: '#9CA3AF' }]}>
                        <TouchableOpacity
                            style={styles.placeholderTouchArea}
                            onPress={() => onAction('add', item.id)}
                            activeOpacity={0.6}
                        >
                            <Feather name="plus" size={24} color="#D1D5DB" />
                        </TouchableOpacity>

                        {isPrimary && (
                            <Text style={[styles.primaryBadgeText, { position: 'absolute', top: 12, color: '#9CA3AF' }]}>
                                PRIMARY
                            </Text>
                        )}

                        <ActionCircle
                            iconName="plus"
                            iconSize={22}
                            color={COLORS.white}
                            backgroundColor={COLORS.black}
                            onPress={() => onAction('add', item.id)}
                            style={styles.mediaActionPosition}
                            useFeather
                        />
                    </View>
                )}
            </Animated.View>
        </View>
    );
};

const PhotosScreen = ({ onNext, onBack }) => {
    const { dispatch } = useOnboarding();
    const [mediaItems, setMediaItems] = useState([
        { id: '1', type: 'empty' },
        { id: '2', type: 'empty' },
        { id: '3', type: 'empty' },
        { id: '4', type: 'empty' },
        { id: '5', type: 'empty' },
        { id: '6', type: 'empty' },
    ]);

    const currentIndex = STEP_ORDER.indexOf('photos');
    const totalSteps = STEP_ORDER.length;

    const uploadedCount = mediaItems.filter(i => i.type === 'image').length;
    const canProceed = uploadedCount >= 1;

    // Fade the grid in on first photo added
    const gridOpacity = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        if (uploadedCount > 0) {
            Animated.timing(gridOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [uploadedCount > 0]);

    const handleMediaAction = (type, id) => {
        Alert.alert(
            type === 'add' ? 'Add Photo' : 'Edit Photo',
            'Photo upload will be available in the full app. Tap "Demo" to add a sample photo.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Add Demo Photo',
                    onPress: () => setMediaItems(prev => prev.map(item =>
                        item.id === id
                            ? { ...item, type: 'image', uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGHmb0m0CN6LM6x2b4ndwai7oGyd9ywUwTYghkA7LK76I_5d1wWT8EEALK_tTv3N4PkwT2RsKh1NoQEInX5xZiIcmdn_1UrP4-dmL1pLBeFWOVpc-JfBYwgK0CwIt0sgzJ2OegAUp1jU5sVjy3jwWq2DQQG92F-w0FpSPkLCgz50_-xkw96plIE0xnfcnOpQg46fJZPaa3xqsZ1FpYABOOTveHza1maPTm5TusNj1m8X_Oja-zSH-f8Z8yKqRe7Y64yRTG7pE-i9E' }
                            : item
                    ))
                },
            ]
        );
    };

    const handleNext = () => {
        const uris = mediaItems.filter(i => i.type === 'image').map(i => i.uri);
        dispatch({ type: 'SET_FIELD', field: 'photos', value: uris });
        onNext();
    };

    return (
        <View style={sharedStyles.screenContainer}>
            <View style={sharedStyles.header}>
                <BackButton onPress={onBack} />
            </View>
            <StepIndicator currentIndex={currentIndex} totalSteps={totalSteps} />
            <ScrollView contentContainerStyle={sharedStyles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={sharedStyles.content}>
                    <View style={{ alignItems: 'center', marginBottom: 30 }}>
                        <Text style={[sharedStyles.title, { textAlign: 'center', fontSize: 28, marginBottom: 8 }]}>Show them who you are</Text>
                        <Text style={[sharedStyles.bodyText, { textAlign: 'center', marginBottom: 0 }]}>Tap to add, drag to reorder</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 6 }}>
                            <MaterialIcons name="error" size={14} color={canProceed ? COLORS.black : COLORS.primary} />
                            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: canProceed ? COLORS.black : COLORS.primary, letterSpacing: 1, textTransform: 'uppercase' }}>
                                {uploadedCount} / 6 photos added
                            </Text>
                        </View>
                    </View>
                    {/* ── Empty state / photo grid ──────────────── */}
                    {uploadedCount === 0 ? (
                        <TouchableOpacity
                            style={styles.emptyZone}
                            onPress={() => handleMediaAction('add', '1')}
                            activeOpacity={0.7}
                            accessibilityLabel="Add your first photo"
                        >
                            <Feather name="camera" size={48} color={COLORS.lightGray} />
                            <Text style={styles.emptyTitle}>Add your best photos</Text>
                            <Text style={styles.emptySubtitle}>You need at least 1 to continue</Text>
                        </TouchableOpacity>
                    ) : (
                        <Animated.View style={[styles.mediaGrid, { opacity: gridOpacity }]}>
                            {mediaItems.map((item, index) => (
                                <MediaSlotItem key={item.id} item={item} index={index} onAction={handleMediaAction} />
                            ))}
                        </Animated.View>
                    )}
                    <View style={styles.tipCard}>
                        <MaterialIcons name="lightbulb" size={22} color={COLORS.black} style={{ marginTop: 2 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.tipText}>
                                Not sure which photos to use? <Text style={styles.tipLink}>See what works</Text> based on research.
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={sharedStyles.footer}>
                <View style={{ flex: 1 }} />
                <FAB
                    onPress={handleNext}
                    disabled={!canProceed}
                    hint="Add at least one photo to continue"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    emptyZone: {
        flex: 1,
        minHeight: 260,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: COLORS.lightGray,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginBottom: 32,
    },
    emptyTitle: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
        color: COLORS.gray,
        marginTop: 4,
    },
    emptySubtitle: {
        fontFamily: 'Inter_400Regular',
        fontSize: 13,
        color: '#9CA3AF',
    },
    mediaGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
        justifyContent: 'center',
    },
    mediaSlot: {
        width: '33.33%',
        aspectRatio: 1,
        padding: 8,
    },
    mediaSlotPrimary: {
        width: '66.66%',
        aspectRatio: 1,
    },
    mediaSlotContent: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#F3F4F6',
    },
    mediaImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    mediaDashedBorder: {
        flex: 1,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderTouchArea: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    primaryBadgeText: {
        fontFamily: 'Inter_700Bold',
        fontSize: 10,
        color: COLORS.white,
        letterSpacing: 1,
    },
    actionCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    mediaActionPosition: {
        position: 'absolute',
        bottom: 8,
        right: 8,
    },
    tipCard: {
        flexDirection: 'row',
        backgroundColor: '#F9FAFB',
        borderRadius: 20,
        padding: 24,
        marginTop: 32,
        marginBottom: 40,
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        gap: 16,
    },
    tipText: {
        fontFamily: 'Inter_400Regular',
        fontSize: 15,
        color: COLORS.text,
        lineHeight: 22,
    },
    tipLink: {
        fontFamily: 'Inter_700Bold',
        textDecorationLine: 'underline',
    },
});

export default PhotosScreen;
