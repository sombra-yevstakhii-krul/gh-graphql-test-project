import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { LocalStorageMock } from '@react-mock/localstorage';

test('renders login link without token', () => {
  const { getByText } = render(
    <LocalStorageMock>
      <App />
    </LocalStorageMock>
  );
  const linkElement = getByText(/Login using github/i);
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
