import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useOnboarding } from '../context/OnboardingContext';
import StepIndicator from '../components/StepIndicator';
import BackButton from '../components/BackButton';
import FAB from '../components/FAB';
import OptionRow from '../components/OptionRow';
import VisibilityToggle from '../components/VisibilityToggle';
import PremiumScreenWrapper from '../components/PremiumScreenWrapper';
import COLORS from '../constants/colors';
import { STEP_ORDER } from '../constants/steps';
import sharedStyles from '../styles/shared';

const RelationshipTypeScreen = ({ onNext, onBack }) => {
    const { dispatch } = useOnboarding();
    const [selectedType, setSelectedType] = useState(null);
    const [customText, setCustomText] = useState('');
    const [isVisible, setIsVisible] = useState(true);

    const currentIndex = STEP_ORDER.indexOf('relationshipType');
    const totalSteps = STEP_ORDER.length;

    const handleNext = () => {
        dispatch({ type: 'SET_FIELD', field: 'relationshipType', value: selectedType });
        dispatch({ type: 'SET_FIELD', field: 'isVisible', key: 'relationshipType', value: isVisible });
        onNext();
    };

    const options = [
        { id: 'monogamy', label: 'Monogamy' },
        { id: 'non-monogamy', label: 'Non-monogamy' },
        { id: 'figuring', label: 'Figuring out my relationship type' },
    ];

    return (
        <View style={sharedStyles.screenContainer}>
            <View style={sharedStyles.header}>
                <BackButton onPress={onBack} />
            </View>
            <StepIndicator currentIndex={currentIndex} totalSteps={totalSteps} />
            <ScrollView contentContainerStyle={sharedStyles.scrollContent} showsVerticalScrollIndicator={false}>
                <PremiumScreenWrapper>
                    <View style={sharedStyles.content}>
                        <Text style={sharedStyles.title}>The connection you seek</Text>
                        <View style={styles.relationshipOptions}>
                            {options.map((option) => (
                                <OptionRow
                                    key={option.id}
                                    label={option.label}
                                    selected={selectedType === option.id}
                                    onPress={() => setSelectedType(option.id)}
                                    activeColor={COLORS.black}
                                    variant="radio"
                                    style={[
                                        styles.relationshipRow,
                                        selectedType === option.id && styles.relationshipRowSelected
                                    ]}
                                    labelStyle={selectedType === option.id && styles.relationshipLabelSelected}
                                />
                            ))}
                        </View>
                        <View style={styles.customInputContainer}>
                            <TextInput
                                style={styles.customTextArea}
                                placeholder="Share more about what you're looking for in your own words"
                                placeholderTextColor={COLORS.gray}
                                multiline
                                numberOfLines={2}
                                value={customText}
                                onChangeText={setCustomText}
                                selectionColor={COLORS.black}
                            />
                            <View style={styles.addIconCircle}>
                                <MaterialIcons name="add" size={20} color={COLORS.white} />
                            </View>
                        </View>
                    </View>
                </PremiumScreenWrapper>
            </ScrollView>
            <View style={sharedStyles.footer}>
                <VisibilityToggle
                    isVisible={isVisible}
                    onToggle={() => setIsVisible(!isVisible)}
                    activeColor={COLORS.black}
                    style={{ flex: 1, paddingRight: 20 }}
                />
                <FAB
                    onPress={handleNext}
                    disabled={!selectedType}
                    hint="Select your relationship type to continue"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    relationshipOptions: {
        marginTop: 0,
    },
    relationshipRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginHorizontal: -16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        borderRadius: 16,
    },
    relationshipRowSelected: {
        backgroundColor: '#F9FAFB',
        borderBottomColor: COLORS.black,
    },
    relationshipLabelSelected: {
        color: COLORS.black,
        fontFamily: 'Inter_600SemiBold',
    },
    customInputContainer: {
        marginTop: 32,
        padding: 20,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: COLORS.inactiveBorder,
        borderStyle: 'dashed',
        backgroundColor: '#F9FAFB',
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 100,
    },
    customTextArea: {
        flex: 1,
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
        color: COLORS.text,
        textAlignVertical: 'top',
        height: '100%',
    },
    addIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.black,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
});

export default RelationshipTypeScreen;
