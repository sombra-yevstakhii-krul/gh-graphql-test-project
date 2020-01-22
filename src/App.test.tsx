import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { LocalStorageMock } from '@react-mock/localstorage';
import 'mocks/matchMedia.mock';

describe('App component', () => {
  test('renders login link without token', async () => {
    const { findByText } = render(
      <LocalStorageMock>
        <App />
      </LocalStorageMock>
    );
    const linkElement = await findByText(/Login using github/i);
    expect(linkElement).toBeInTheDocument();
  });

  test("doesn't render login link with token", () => {
    const { queryByText } = render(
      <LocalStorageMock items={{ token: 'mocked token' }}>
        <App />
      </LocalStorageMock>
    );
    const linkElement = queryByText(/Login using github/i);
    expect(linkElement).not.toBeInTheDocument();
  });
});
