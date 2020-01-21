import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import AppContainer from 'components/AppContainer/AppContainer';
import { act } from 'react-dom/test-utils';

it('toggles selected user on click', async () => {
  const { findByText } = render(
    <MockedProvider mocks={[]}>
      <AppContainer />
    </MockedProvider>
  );

  await act(async () => {
    const chip = (await findByText('sombra-yuriy')).parentElement;
    const isSelected = chip?.classList.contains('MuiChip-colorPrimary');
    chip?.click();
    if (isSelected) {
      expect(chip).not.toHaveClass('MuiChip-colorPrimary');
    } else {
      expect(chip).toHaveClass('MuiChip-colorPrimary');
    }
  });
});
