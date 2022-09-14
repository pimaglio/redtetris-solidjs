import { describe, expect, test } from 'vitest';

import { render } from 'solid-testing-library';

import { ButtonSpinner } from './index';

describe('<ButtonSpinner />', () => {
    test('render loading', () => {
        const { getByTestId, unmount } = render(() => <ButtonSpinner isLoading />);
        expect(getByTestId('button-loading-svg')).toBeInTheDocument();
        unmount();
    });
});
