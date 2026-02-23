import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

// Onboarding Screens
import NameScreen from '../screens/NameScreen';
import BirthdayScreen from '../screens/BirthdayScreen';
import GenderScreen from '../screens/GenderScreen';
import SexualityScreen from '../screens/SexualityScreen';
import RelationshipTypeScreen from '../screens/RelationshipTypeScreen';
import DatingIntentionScreen from '../screens/DatingIntentionScreen';
import HeightScreen from '../screens/HeightScreen';
import HometownScreen from '../screens/HometownScreen';
import WorkplaceScreen from '../screens/WorkplaceScreen';
import EducationScreen from '../screens/EducationScreen';
import SchoolScreen from '../screens/SchoolScreen';
import ReligionScreen from '../screens/ReligionScreen';
import ChildrenScreen from '../screens/ChildrenScreen';
import TobaccoScreen from '../screens/TobaccoScreen';
import DrinkingScreen from '../screens/DrinkingScreen';
import LocationScreen from '../screens/LocationScreen';
import PhotosScreen from '../screens/PhotosScreen';
import BioScreen from '../screens/BioScreen';
import VerificationScreen from '../screens/VerificationScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ReviewScreen from '../screens/ReviewScreen';
import SuccessScreen from '../screens/SuccessScreen';

// Components & Utils
import AgeConfirmationModal from '../components/AgeConfirmationModal';
import ChapterTransition from '../components/ChapterTransition';
import { calculateAge } from '../utils/dateHelpers';
import { STEP_ORDER } from '../constants/steps';
import { useOnboarding } from '../context/OnboardingContext';

// Main Screens
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();

// Chapter boundary config
const CHAPTER_NAMES = [
    { upToIndex: 5, label: 'Chapter 1: About You' },
    { upToIndex: 15, label: 'Chapter 2: Your Life' },
    { upToIndex: 19, label: 'Chapter 3: Your Photos' },
];

const getChapterLabel = (idx: number) => {
    for (const c of CHAPTER_NAMES) {
        if (idx <= c.upToIndex) return c.label;
    }
    return CHAPTER_NAMES[CHAPTER_NAMES.length - 1].label;
};

export const OnboardingStack = ({ onComplete }: { onComplete: () => void }) => {
    const [stepIndex, setStepIndex] = useState(0);
    const [step, setStep] = useState(STEP_ORDER[0]);
    const [digits, setDigits] = useState(['', '', '', '', '', '', '', '']);
    const [showAgeModal, setShowAgeModal] = useState(false);
    const [ageError, setAgeError] = useState<string | null>(null);
    const currentChapterLabel = getChapterLabel(stepIndex);
    const prevChapterRef = useRef(currentChapterLabel);
    const { dispatch } = useOnboarding();

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
        // Commit birthday into OnboardingContext as { day, month, year }
        dispatch({
            type: 'SET_FIELD',
            field: 'birthday',
            value: {
                day: parseInt(digits[0] + digits[1]),
                month: parseInt(digits[2] + digits[3]),
                year: parseInt(digits[4] + digits[5] + digits[6] + digits[7]),
            },
        });
        setShowAgeModal(false);
        setAgeError(null);
        goNext();
    };

    return (
        <View style={{ flex: 1 }}>
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
                ) : step === 'bio' ? (
                    <BioScreen key="bio" onNext={goNext} onBack={goBack} />
                ) : step === 'verification' ? (
                    <VerificationScreen key="verification" onNext={goNext} onBack={goBack} />
                ) : step === 'notifications' ? (
                    <NotificationsScreen key="notifications" onNext={goNext} onBack={goBack} />
                ) : step === 'success' ? (
                    <SuccessScreen key="success" onComplete={onComplete} />
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

                <ChapterTransition key="transition" chapterName={currentChapterLabel} />
            </KeyboardAvoidingView>
        </View>
    );
};

export const MainStack = () => <MainTabNavigator />;
