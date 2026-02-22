import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import FAB from '../FAB';

// Mock vector icons
jest.mock('@expo/vector-icons', () => ({
    MaterialIcons: 'MaterialIcons',
}));

describe('FAB', () => {
    it('renders correctly when enabled', () => {
        const { getByRole } = render(<FAB onPress={() => { }} disabled={false} />);
        const fab = getByRole('button');
        expect(fab).toBeDefined();
    });

    it('calls onPress when tapped and enabled', () => {
        const onPressMock = jest.fn();
        const { getByRole } = render(<FAB onPress={onPressMock} disabled={false} />);
        const fab = getByRole('button');

        fireEvent.press(fab);
        expect(onPressMock).toHaveBeenCalled();
    });

    it('does NOT call onPress when tapped and disabled', () => {
        const onPressMock = jest.fn();
        const { getByRole } = render(<FAB onPress={onPressMock} disabled={true} />);
        const fab = getByRole('button');

        fireEvent.press(fab);
        expect(onPressMock).not.toHaveBeenCalled();
    });

    it('shows hint tooltip after tapping disabled FAB and disappears after 2 seconds', () => {
        jest.useFakeTimers();
        const hint = "Complete fields";
        const { getByTestId, queryByTestId } = render(
            <FAB onPress={() => { }} disabled={true} hint={hint} />
        );

        const fab = getByTestId('fab-button');
        act(() => {
            fireEvent(fab, 'press');
        });

        // Check hint is visible
        expect(getByTestId('fab-hint-text')).toBeDefined();
        expect(getByTestId('fab-hint-text').props.children).toBe(hint);

        // Advance timers by 2 seconds + some buffer
        act(() => {
            jest.advanceTimersByTime(2500);
        });

        // Hint should be removed from DOM or hidden
        expect(queryByTestId('fab-hint-text')).toBeNull();

        jest.useRealTimers();
    });
});
