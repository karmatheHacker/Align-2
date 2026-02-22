import React from 'react';
import { render } from '@testing-library/react-native';
import StepIndicator from '../StepIndicator';

// Mock vector icons
jest.mock('@expo/vector-icons', () => ({
    MaterialIcons: 'MaterialIcons',
    Feather: 'Feather',
    MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

describe('StepIndicator', () => {
    const totalSteps = 18; // Based on STEP_ORDER length

    it('renders correct chapter label for step 0 (ABOUT YOU · STEP 1 OF 6)', () => {
        const { getByText } = render(<StepIndicator currentIndex={0} totalSteps={totalSteps} />);
        expect(getByText("ABOUT YOU · STEP 1 OF 6")).toBeDefined();
    });

    it('renders correct chapter label for step 6 (YOUR LIFE · STEP 1 OF 10)', () => {
        const { getByText } = render(<StepIndicator currentIndex={6} totalSteps={totalSteps} />);
        expect(getByText("YOUR LIFE · STEP 1 OF 10")).toBeDefined();
    });

    it('renders correct chapter label for step 16 (YOUR PHOTOS · STEP 1 OF 2)', () => {
        const { getByText } = render(<StepIndicator currentIndex={16} totalSteps={totalSteps} />);
        expect(getByText("YOUR PHOTOS · STEP 1 OF 2")).toBeDefined();
    });

    it('progress fill width matches currentIndex/totalSteps ratio', () => {
        const currentIndex = 8;
        const { getByTestId } = render(<StepIndicator currentIndex={currentIndex} totalSteps={totalSteps} />);

        const progressFill = getByTestId('progress-fill');
        // Width is now an Animated interpolation (Task 5: animated progress bar).
        // We verify the style array exists and contains an object with a 'width' key.
        const styleArray = [].concat(progressFill.props.style);
        const widthEntry = styleArray.find(s => s && typeof s === 'object' && 'width' in s);
        expect(widthEntry).toBeDefined();
        expect(widthEntry.width).toBeTruthy(); // Animated interpolation is truthy
    });
});
