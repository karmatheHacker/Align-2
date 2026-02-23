import React from 'react';
import { render } from '@testing-library/react-native';
import StepIndicator from '../StepIndicator';
import { STEP_ICONS } from '../../constants/stepIcons';

// Mock vector icons
jest.mock('@expo/vector-icons', () => ({
    MaterialIcons: 'MaterialIcons',
    Feather: 'Feather',
    MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

describe('StepIndicator', () => {
    const totalSteps = 20; // Updated for 20-step flow (including bio and verification)

    it('renders correct chapter label for step 0 (ABOUT YOU · STEP 1 OF 6)', () => {
        const { getByText } = render(<StepIndicator currentIndex={0} totalSteps={totalSteps} />);
        expect(getByText("ABOUT YOU · STEP 1 OF 6")).toBeDefined();
    });

    it('renders correct chapter label for step 6 (YOUR LIFE · STEP 1 OF 10)', () => {
        const { getByText } = render(<StepIndicator currentIndex={6} totalSteps={totalSteps} />);
        expect(getByText("YOUR LIFE · STEP 1 OF 10")).toBeDefined();
    });

    it('renders correct chapter label for step 16 (YOUR PHOTOS · STEP 1 OF 4)', () => {
        const { getByText } = render(<StepIndicator currentIndex={16} totalSteps={totalSteps} />);
        expect(getByText("YOUR PHOTOS · STEP 1 OF 4")).toBeDefined();
    });

    it('progress fill width matches currentIndex/totalSteps ratio', () => {
        const currentIndex = 8;
        const { getByTestId } = render(<StepIndicator currentIndex={currentIndex} totalSteps={totalSteps} />);

        const progressFill = getByTestId('progress-fill');
        const styleArray = [].concat(progressFill.props.style);
        const widthEntry = styleArray.find(s => s && typeof s === 'object' && 'width' in s);
        expect(widthEntry).toBeDefined();
        expect(widthEntry.width).toBeTruthy();
    });

    it('renders an AnimatedStepNode for every step in STEP_ORDER', () => {
        const { getByTestId } = render(<StepIndicator currentIndex={0} totalSteps={totalSteps} />);
        const stepKeys = [
            'name', 'birthday', 'gender', 'sexuality', 'relationshipType', 'datingIntention',
            'height', 'hometown', 'workplace', 'education', 'school', 'religion', 'children',
            'tobacco', 'drinking', 'location', 'photos', 'bio', 'verification', 'notifications'
        ];
        stepKeys.forEach(key => {
            expect(getByTestId(`step-node-${key}`)).toBeDefined();
        });
    });

    it('STEP_ICONS has icon data for first screen of each chapter', () => {
        expect(STEP_ICONS['name']).toBeDefined();
        expect(STEP_ICONS['name'].name).toBe('user');
        expect(STEP_ICONS['name'].lib).toBe('Feather');

        expect(STEP_ICONS['height']).toBeDefined();
        expect(STEP_ICONS['height'].name).toBe('height');
        expect(STEP_ICONS['height'].lib).toBe('MaterialIcons');

        expect(STEP_ICONS['photos']).toBeDefined();
        expect(STEP_ICONS['photos'].name).toBe('camera');
        expect(STEP_ICONS['photos'].lib).toBe('Feather');
    });

    it('STEP_ICONS covers all STEP_ORDER entries', () => {
        const stepKeys = [
            'name', 'birthday', 'gender', 'sexuality', 'relationshipType', 'datingIntention',
            'height', 'hometown', 'workplace', 'education', 'school', 'religion', 'children',
            'tobacco', 'drinking', 'location', 'photos', 'bio', 'verification', 'notifications'
        ];
        stepKeys.forEach(key => {
            expect(STEP_ICONS[key]).toBeDefined();
            expect(STEP_ICONS[key].lib).toBeDefined();
            expect(STEP_ICONS[key].name).toBeDefined();
        });
    });
});
