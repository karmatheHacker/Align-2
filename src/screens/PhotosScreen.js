import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Animated, Alert, StyleSheet } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useOnboarding } from '../context/OnboardingContext';
import StepIndicator from '../components/StepIndicator';
import BackButton from '../components/BackButton';
import FAB from '../components/FAB';
import COLORS from '../constants/colors';
import { STEP_ORDER } from '../constants/steps';
import SPACING from '../constants/spacing';
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
    const isRequired = index < 3;
    const isFilled = item.type === 'image';

    return (
        <View style={styles.mediaSlot}>
            {isFilled ? (
                <View style={styles.mediaSlotFilled}>
                    <Image source={{ uri: item.uri }} style={styles.mediaImage} />
                    <ActionCircle
                        iconName="edit"
                        iconSize={16}
                        color={COLORS.black}
                        backgroundColor={COLORS.white}
                        onPress={() => onAction('edit', item.id)}
                        style={styles.editButton}
                    />
                </View>
            ) : (
                <TouchableOpacity
                    style={[
                        styles.mediaSlotEmpty,
                        isRequired ? styles.requiredSlot : styles.optionalSlot
                    ]}
                    onPress={() => onAction('add', item.id)}
                    activeOpacity={0.6}
                >
                    <Feather name="plus" size={24} color="#D1D5DB" />
                    {isRequired && (
                        <View style={styles.requiredIndicator}>
                            <Text style={styles.requiredText}>REQ</Text>
                        </View>
                    )}
                </TouchableOpacity>
            )}
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
    const canProceed = uploadedCount >= 3;

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
                            ? { ...item, type: 'image', uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2487&auto=format&fit=crop' }
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

    // Counter logic
    const getCounterConfig = () => {
        if (uploadedCount === 0) return { icon: 'alert-circle', color: COLORS.gray };
        if (uploadedCount < 3) return { icon: 'alert-circle', color: COLORS.black };
        return { icon: 'check-circle', color: COLORS.black };
    };
    const counter = getCounterConfig();

    return (
        <View style={sharedStyles.screenContainer}>
            <StepIndicator currentIndex={currentIndex} totalSteps={totalSteps} onBack={onBack} />
            <ScrollView contentContainerStyle={sharedStyles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={sharedStyles.content}>
                    <View style={{ alignItems: 'center', marginBottom: SPACING.xl }}>
                        <Text style={[sharedStyles.title, { textAlign: 'center', fontSize: 32, marginBottom: 8 }]}>Show them who you are</Text>
                        <Text style={[sharedStyles.bodyText, { textAlign: 'center', marginBottom: 0 }]}>
                            Tap to add photos. At least 3 required.
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 8 }}>
                            <Feather name={counter.icon} size={16} color={counter.color} />
                            <Text style={{
                                fontFamily: 'Inter_600SemiBold',
                                fontSize: 13,
                                color: counter.color,
                                letterSpacing: 1,
                                textTransform: 'uppercase'
                            }}>
                                {uploadedCount} / 6 PHOTOS ADDED
                            </Text>
                        </View>
                    </View>

                    <View style={styles.mediaGrid}>
                        {mediaItems.map((item, index) => (
                            <MediaSlotItem key={item.id} item={item} index={index} onAction={handleMediaAction} />
                        ))}
                    </View>

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
                    hint="Add at least 3 photos to continue"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mediaGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -SPACING.xs,
    },
    mediaSlot: {
        width: '33.33%',
        aspectRatio: 1,
        padding: SPACING.xs,
    },
    mediaSlotFilled: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#F3F4F6',
    },
    mediaSlotEmpty: {
        flex: 1,
        borderRadius: 12,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    requiredSlot: {
        borderWidth: 2,
        borderColor: COLORS.black,
    },
    optionalSlot: {
        borderWidth: 1.5,
        borderColor: COLORS.lightGray,
    },
    requiredIndicator: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    requiredText: {
        fontFamily: 'Inter_700Bold',
        fontSize: 8,
        color: COLORS.gray,
    },
    mediaImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    editButton: {
        position: 'absolute',
        bottom: 6,
        right: 6,
    },
    actionCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    tipCard: {
        flexDirection: 'row',
        backgroundColor: '#F9FAFB',
        borderRadius: 20,
        padding: 24,
        marginTop: SPACING.xl,
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
