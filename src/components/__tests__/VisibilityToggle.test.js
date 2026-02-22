import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import VisibilityToggle from '../VisibilityToggle';

// Mock vector icons
jest.mock('@expo/vector-icons', () => ({
    Feather: 'Feather',
}));

describe('VisibilityToggle', () => {
    it('renders "Visible on profile" when isVisible=true', () => {
        const { getByText } = render(<VisibilityToggle isVisible={true} onToggle={() => { }} />);
        expect(getByText("Visible on profile")).toBeDefined();
    });

    it('renders "Hidden on profile" when isVisible=false', () => {
        const { getByText } = render(<VisibilityToggle isVisible={false} onToggle={() => { }} />);
        expect(getByText("Hidden on profile")).toBeDefined();
    });

    it('calls onToggle when pressed', () => {
        const onToggleMock = jest.fn();
        const { getByRole } = render(<VisibilityToggle isVisible={true} onToggle={onToggleMock} />);
        const toggle = getByRole('checkbox');

        fireEvent.press(toggle);
        expect(onToggleMock).toHaveBeenCalled();
    });

    it('uses #555555 for off-state text color', () => {
        const { getByText } = render(<VisibilityToggle isVisible={false} onToggle={() => { }} />);
        const text = getByText("Hidden on profile");
        // RNTL can check styles if using @testing-library/jest-native
        expect(text.props.style).toContainEqual({ color: '#555555' });
    });
});
