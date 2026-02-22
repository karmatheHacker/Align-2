import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Image, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useOnboarding } from '../context/OnboardingContext';
import StepIndicator from '../components/StepIndicator';
import BackButton from '../components/BackButton';
import FAB from '../components/FAB';
import COLORS from '../constants/colors';
import { STEP_ORDER } from '../constants/steps';
import sharedStyles from '../styles/shared';
import PremiumScreenWrapper from '../components/PremiumScreenWrapper';

const LocationScreen = ({ onNext, onBack }) => {
    const { dispatch } = useOnboarding();
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapError, setMapError] = useState(false);
    const [location, setLocation] = useState('');

    const currentIndex = STEP_ORDER.indexOf('location');
    const totalSteps = STEP_ORDER.length;

    const handleNext = () => {
        dispatch({ type: 'SET_FIELD', field: 'location', value: location });
        onNext();
    };

    return (
        <View style={sharedStyles.screenContainer}>
            <ScrollView
                contentContainerStyle={sharedStyles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={sharedStyles.header}>
                    <BackButton onPress={onBack} />
                </View>
                <StepIndicator currentIndex={currentIndex} totalSteps={totalSteps} />

                <PremiumScreenWrapper animateEntrance>
                    <View style={sharedStyles.content}>
                        <Text style={sharedStyles.title}>Where do you live?</Text>
                        <Text style={sharedStyles.bodyText}>Only the neighborhood name will appear on your profile.</Text>

                        <View style={styles.mapContainer}>
                            <View style={[styles.mapImage, { overflow: 'hidden' }]}>
                                {!mapError ? (
                                    <>
                                        {!mapLoaded && (
                                            <View style={[StyleSheet.absoluteFillObject, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#E5E7EB' }]}>
                                                <ActivityIndicator size="small" color={COLORS.gray} />
                                            </View>
                                        )}
                                        <Image
                                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC17sE9F1fdq0EYWTW9LkMoVb0-aExY4HgzJNKF5ZYC63B7KubgStUArgc0cslCCduhUDwVRH2SSMk2Q7P_xjrMjksjklXko0k4wHYpcwkaStrykVXi7hb_a6LAxuMzR_0COHwa6OabjGYQi8bcNrFpO97YR3gjH3dH_ZjyHirE0OVPc7Np3EmqRQPK0nHdwjme36rT7rP1E2Dr6EZ0yHXXA7dsoJlrWU463EWAG9Ep-WrV-6OOLzA6eo-hzcY2kWhVWTD_8OSpfLY' }}
                                            style={StyleSheet.absoluteFillObject}
                                            onLoad={() => setMapLoaded(true)}
                                            onError={() => setMapError(true)}
                                            accessibilityLabel="Map showing your approximate neighborhood"
                                            accessibilityRole="image"
                                        />
                                    </>
                                ) : (
                                    <View style={[StyleSheet.absoluteFillObject, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#E5E7EB', gap: 8 }]}>
                                        <MaterialIcons name="map" size={32} color={COLORS.gray} />
                                        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.gray }}>
                                            Map unavailable
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <TouchableOpacity style={styles.gpsButton} activeOpacity={0.8}>
                                <MaterialIcons name="my-location" size={20} color={COLORS.white} />
                            </TouchableOpacity>

                            <View style={styles.tooltipContainer}>
                                <View style={styles.tooltip}>
                                    <MaterialIcons name="warning" size={14} color={COLORS.white} style={{ marginRight: 6 }} />
                                    <Text style={styles.tooltipText}>Zoom in to your neighborhood</Text>
                                </View>
                                <View style={styles.tooltipArrow} />
                            </View>
                        </View>

                        <View style={styles.searchContainer}>
                            <Feather name="search" size={20} color={COLORS.gray} style={{ marginRight: 12 }} />
                            <TextInput
                                style={styles.locationSearchInput}
                                placeholder="Enter your address, neighborhood, or ZIP"
                                placeholderTextColor="#9CA3AF"
                                selectionColor={COLORS.black}
                                value={location}
                                onChangeText={setLocation}
                            />
                        </View>
                    </View>
                </PremiumScreenWrapper>
            </ScrollView>

            <View style={sharedStyles.footer}>
                <View style={styles.privacyFooter}>
                    <MaterialIcons name="lock" size={14} color={COLORS.gray} style={{ marginRight: 6 }} />
                    <Text style={styles.privacyFooterText}>Your exact address is never shared.</Text>
                </View>
                <FAB onPress={handleNext} disabled={!location.trim()} hint="Enter your location to continue" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mapContainer: {
        width: '100%',
        height: 240,
        borderRadius: 24,
        marginBottom: 32,
        position: 'relative',
        backgroundColor: '#E5E7EB',
    },
    mapImage: {
        width: '100%',
        height: '100%',
        borderRadius: 24,
    },
    gpsButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.black,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    tooltipContainer: {
        position: 'absolute',
        top: '40%',
        left: '50%',
        marginLeft: -100,
        alignItems: 'center',
        width: 200,
    },
    tooltip: {
        backgroundColor: '#1F2937',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
    },
    tooltipText: {
        color: COLORS.white,
        fontFamily: 'Inter_500Medium',
        fontSize: 12,
    },
    tooltipArrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 6,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#1F2937',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 64,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
    },
    locationSearchInput: {
        flex: 1,
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
        color: COLORS.text,
    },
    privacyFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 20,
        flex: 1,
    },
    privacyFooterText: {
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
        color: COLORS.gray,
    },
});

export default LocationScreen;
