import { describe, expect, test, vi } from 'vitest';

import { render, fireEvent } from 'solid-testing-library';

import SignIn from './SignIn';

describe('<SignIn />', () => {
    test('render form', () => {
        const handleSubmit = vi.fn()
        const { getByLabelText, getByText, unmount } = render(() => <SignIn submit={handleSubmit} />);
        fireEvent.change(getByLabelText(/room/i), {target: {value: 'testroom'}})
        fireEvent.change(getByLabelText(/username/i), {target: {value: 'testplayer'}})

        fireEvent.click(getByText(/join room/i))
        expect(handleSubmit).toHaveBeenCalledTimes(1)
        unmount();
    });
});
