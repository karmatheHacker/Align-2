import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useOnboarding } from '../context/OnboardingContext';
import StepIndicator from '../components/StepIndicator';
import BackButton from '../components/BackButton';
import FAB from '../components/FAB';
import VisibilityToggle from '../components/VisibilityToggle';
import PremiumScreenWrapper from '../components/PremiumScreenWrapper';
import COLORS from '../constants/colors';
import { STEP_ORDER } from '../constants/steps';
import sharedStyles from '../styles/shared';

const HeightScreen = ({ onNext, onBack }) => {
    const { dispatch } = useOnboarding();
    const [unit, setUnit] = useState('FT');
    const [selectedHeight, setSelectedHeight] = useState(70);
    const [isVisible, setIsVisible] = useState(true);

    const currentIndex = STEP_ORDER.indexOf('height');
    const totalSteps = STEP_ORDER.length;

    const handleNext = () => {
        dispatch({ type: 'SET_FIELD', field: 'height', value: { value: selectedHeight, unit } });
        dispatch({ type: 'SET_FIELD', field: 'isVisible', key: 'height', value: isVisible });
        onNext();
    };

    const scrollRef = useRef(null);
    const ITEM_HEIGHT = 80;

    const heights = unit === 'FT'
        ? Array.from({ length: 49 }, (_, i) => i + 48)
        : Array.from({ length: 124 }, (_, i) => i + 121);

    const handleUnitToggle = (newUnit) => {
        if (unit === newUnit) return;
        let newValue = newUnit === 'CM' ? Math.round(selectedHeight * 2.54) : Math.round(selectedHeight / 2.54);
        setUnit(newUnit);
        setSelectedHeight(newValue);
        const newList = newUnit === 'FT'
            ? Array.from({ length: 49 }, (_, i) => i + 48)
            : Array.from({ length: 124 }, (_, i) => i + 121);
        const index = newList.indexOf(newValue);
        if (index !== -1) setTimeout(() => { scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: false }); }, 10);
    };

    const onScrollEnd = (event) => {
        const y = event.nativeEvent.contentOffset.y;
        const index = Math.round(y / ITEM_HEIGHT);
        if (heights[index]) setSelectedHeight(heights[index]);
    };

    return (
        <View style={sharedStyles.screenContainer}>
            <View style={sharedStyles.header}>
                <View style={{ height: 11 }} />
            </View>
            <View style={styles.topActions}>
                <BackButton onPress={onBack} />
                <View style={{ flex: 1 }}>
                    <StepIndicator currentIndex={currentIndex} totalSteps={totalSteps} />
                </View>
                <TouchableOpacity onPress={onNext} style={styles.skipContainer}>
                    <Text style={styles.skipButtonText}>SKIP</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <PremiumScreenWrapper>
                    <View style={sharedStyles.content}>
                        <Text style={[sharedStyles.title, { textAlign: 'center' }]}>Your natural stature</Text>
                        <Text style={[sharedStyles.bodyText, { textAlign: 'center', marginTop: -20, marginBottom: 40 }]}>How you stand in the world.</Text>
                        <View style={styles.staturePickerContainer}>
                            <View style={styles.staturePickerHero}>
                                <LinearGradient colors={[COLORS.surface, 'transparent', 'transparent', COLORS.surface]} locations={[0, 0.2, 0.8, 1]} style={styles.pickerGradientOverlay} pointerEvents="none" />
                                <View style={styles.pickerSelectionRing} pointerEvents="none" />
                                <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} snapToInterval={ITEM_HEIGHT} decelerationRate="fast" onMomentumScrollEnd={onScrollEnd} contentContainerStyle={{ paddingVertical: 160 }}>
                                    {heights.map((item) => {
                                        const isActive = selectedHeight === item;
                                        return (
                                            <View key={`${unit}-${item}`} style={[styles.statureItem, { height: ITEM_HEIGHT }]}>
                                                <Text style={[styles.statureValue, isActive && styles.statureValueActive]}>
                                                    {unit === 'FT' ? (
                                                        <React.Fragment>
                                                            <Text style={styles.statureMainValue}>{Math.floor(item / 12)}</Text>
                                                            <Text style={styles.statureSubValue}>ft </Text>
                                                            <Text style={styles.statureMainValue}>{item % 12}</Text>
                                                            <Text style={styles.statureSubValue}>in</Text>
                                                        </React.Fragment>
                                                    ) : (
                                                        <React.Fragment>
                                                            <Text style={styles.statureMainValue}>{item}</Text>
                                                            <Text style={styles.statureSubValue}> cm</Text>
                                                        </React.Fragment>
                                                    )}
                                                </Text>
                                            </View>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                            <View style={styles.statureUnitPill}>
                                <TouchableOpacity style={[styles.statureUnitBtn, unit === 'FT' && styles.statureUnitBtnActive]} onPress={() => handleUnitToggle('FT')}>
                                    <Text style={[styles.statureUnitLabel, unit === 'FT' && styles.statureUnitLabelActive]}>FT / IN</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.statureUnitBtn, unit === 'CM' && styles.statureUnitBtnActive]} onPress={() => handleUnitToggle('CM')}>
                                    <Text style={[styles.statureUnitLabel, unit === 'CM' && styles.statureUnitLabelActive]}>CENTIMETERS</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <VisibilityToggle isVisible={isVisible} onToggle={() => setIsVisible(!isVisible)} activeColor={COLORS.black} style={{ marginTop: 40 }} />
                    </View>
                </PremiumScreenWrapper>
            </ScrollView>
            <View style={sharedStyles.footer}>
                <View style={{ flex: 1 }} />
                <FAB
                    onPress={handleNext}
                    accessibilityLabel="Continue to next step"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    topActions: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 28,
        position: 'relative',
        zIndex: 10,
    },
    skipContainer: {
        position: 'absolute',
        right: 20,
    },
    skipButtonText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 13,
        color: '#9CA3AF',
        letterSpacing: 1.5,
    },
    staturePickerContainer: {
        alignItems: 'center',
        width: '100%',
    },
    staturePickerHero: {
        width: '100%',
        height: 400,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerGradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 5,
    },
    pickerSelectionRing: {
        position: 'absolute',
        top: '50%',
        left: 16,
        right: 16,
        height: 80,
        marginTop: -40,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: COLORS.black,
        backgroundColor: 'rgba(0,0,0,0.03)',
        pointerEvents: 'none',
    },
    statureItem: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statureValue: {
        opacity: 0.3,
        textAlign: 'center',
    },
    statureValueActive: {
        opacity: 1,
    },
    statureMainValue: {
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 48,
        color: COLORS.text,
    },
    statureSubValue: {
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
        color: COLORS.gray,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statureUnitPill: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 25,
        padding: 4,
        marginTop: 20,
    },
    statureUnitBtn: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 22,
    },
    statureUnitBtnActive: {
        backgroundColor: COLORS.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 2,
    },
    statureUnitLabel: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 12,
        color: COLORS.gray,
        letterSpacing: 0.5,
    },
    statureUnitLabelActive: {
        color: COLORS.text,
    },
});

export default HeightScreen;
