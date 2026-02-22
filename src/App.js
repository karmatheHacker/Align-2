import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
    useFonts,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
} from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { OnboardingProvider } from './context/OnboardingContext';
import NameScreen from './screens/NameScreen';
import BirthdayScreen from './screens/BirthdayScreen';
import GenderScreen from './screens/GenderScreen';
import SexualityScreen from './screens/SexualityScreen';
import RelationshipTypeScreen from './screens/RelationshipTypeScreen';
import DatingIntentionScreen from './screens/DatingIntentionScreen';
import HeightScreen from './screens/HeightScreen';
import HometownScreen from './screens/HometownScreen';
import WorkplaceScreen from './screens/WorkplaceScreen';
import EducationScreen from './screens/EducationScreen';
import SchoolScreen from './screens/SchoolScreen';
import ReligionScreen from './screens/ReligionScreen';
import ChildrenScreen from './screens/ChildrenScreen';
import TobaccoScreen from './screens/TobaccoScreen';
import DrinkingScreen from './screens/DrinkingScreen';
import LocationScreen from './screens/LocationScreen';
import PhotosScreen from './screens/PhotosScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import SuccessScreen from './screens/SuccessScreen';
import ReviewScreen from './screens/ReviewScreen';
import AgeConfirmationModal from './components/AgeConfirmationModal';
import ChapterTransition from './components/ChapterTransition';
import SkeletonLoader from './components/SkeletonLoader';
import * as Haptics from 'expo-haptics';
import { calculateAge } from './utils/dateHelpers';
import { STEP_ORDER } from './constants/steps';

// Chapter boundary config — maps step indices to display names
const CHAPTER_NAMES = [
    { upToIndex: 5, label: 'Chapter 1: About You' },
    { upToIndex: 15, label: 'Chapter 2: Your Life' },
    { upToIndex: 17, label: 'Chapter 3: Your Photos' },
];

const getChapterLabel = (idx) => {
    for (const c of CHAPTER_NAMES) {
        if (idx <= c.upToIndex) return c.label;
    }
    return CHAPTER_NAMES[CHAPTER_NAMES.length - 1].label;
};

const OnboardingFlow = () => {
    const [stepIndex, setStepIndex] = useState(0);
    const [step, setStep] = useState(STEP_ORDER[0]);
    const [digits, setDigits] = useState(['', '', '', '', '', '', '', '']);
    const [showAgeModal, setShowAgeModal] = useState(false);
    const [ageError, setAgeError] = useState(null);
    const currentChapterLabel = getChapterLabel(stepIndex);
    const prevChapterRef = useRef(currentChapterLabel);

    // Fire haptic when chapter actually changes (skip first render)
    useEffect(() => {
        if (prevChapterRef.current !== currentChapterLabel) {
            prevChapterRef.current = currentChapterLabel;
            try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch (_) { }
        }
    }, [currentChapterLabel]);

    useEffect(() => {
        setStep(STEP_ORDER[stepIndex] || 'review');
    }, [stepIndex]);

    const goNext = () => setStepIndex(prev => prev + 1);
    const goBack = () => setStepIndex(prev => Math.max(0, prev - 1));

    const handleConfirmAge = () => {
        const age = calculateAge(digits);
        if (age < 18) {
            setAgeError("You must be at least 18 years old to use Align.");
            return;
        }
        setShowAgeModal(false);
        setAgeError(null);
        goNext();
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {step === 'name' ? (
                    <NameScreen key="name" onNext={goNext} />
                ) : step === 'birthday' ? (
                    <BirthdayScreen key="birthday" onNext={() => setShowAgeModal(true)} onBack={goBack} digits={digits} setDigits={setDigits} />
                ) : step === 'gender' ? (
                    <GenderScreen key="gender" onNext={goNext} onBack={goBack} />
                ) : step === 'sexuality' ? (
                    <SexualityScreen key="sexuality" onNext={goNext} onBack={goBack} />
                ) : step === 'relationshipType' ? (
                    <RelationshipTypeScreen key="relationship-type" onNext={goNext} onBack={goBack} />
                ) : step === 'datingIntention' ? (
                    <DatingIntentionScreen key="dating-intention" onNext={goNext} onBack={goBack} />
                ) : step === 'height' ? (
                    <HeightScreen key="height" onNext={goNext} onBack={goBack} />
                ) : step === 'hometown' ? (
                    <HometownScreen key="hometown" onNext={goNext} onBack={goBack} />
                ) : step === 'workplace' ? (
                    <WorkplaceScreen key="workplace" onNext={goNext} onBack={goBack} />
                ) : step === 'education' ? (
                    <EducationScreen key="education" onNext={goNext} onBack={goBack} />
                ) : step === 'school' ? (
                    <SchoolScreen key="school" onNext={goNext} onBack={goBack} />
                ) : step === 'religion' ? (
                    <ReligionScreen key="religion" onNext={goNext} onBack={goBack} />
                ) : step === 'children' ? (
                    <ChildrenScreen key="children" onNext={goNext} onBack={goBack} />
                ) : step === 'tobacco' ? (
                    <TobaccoScreen key="tobacco" onNext={goNext} onBack={goBack} />
                ) : step === 'drinking' ? (
                    <DrinkingScreen key="drinking" onNext={goNext} onBack={goBack} />
                ) : step === 'location' ? (
                    <LocationScreen key="location" onNext={goNext} onBack={goBack} />
                ) : step === 'photos' ? (
                    <PhotosScreen key="photos" onNext={goNext} onBack={goBack} />
                ) : step === 'notifications' ? (
                    <NotificationsScreen key="notifications" onNext={goNext} onBack={goBack} />
                ) : step === 'success' ? (
                    <SuccessScreen key="success" />
                ) : (
                    <ReviewScreen key="review" onBack={goBack} onSuccess={() => setStep('success')} />
                )}

                <AgeConfirmationModal
                    visible={showAgeModal}
                    digits={digits}
                    ageError={ageError}
                    onEdit={() => setShowAgeModal(false)}
                    onConfirm={handleConfirmAge}
                />

                {/* Chapter transition overlay — position:absolute, zIndex:999, pointerEvents:none */}
                <ChapterTransition key="transition" chapterName={currentChapterLabel} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default function App() {
    let [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        PlayfairDisplay_700Bold,
    });

    if (!fontsLoaded) {
        return (
            <SafeAreaProvider>
                <SkeletonLoader key="skeleton" />
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <OnboardingProvider>
                <StatusBar barStyle="dark-content" />
                <OnboardingFlow key="main" />
            </OnboardingProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
});
