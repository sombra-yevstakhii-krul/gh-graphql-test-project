import React from 'react';
import { README_QUERY } from 'queries/repo';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import ReadmeModal from './ReadmeModal';

const mocks = [
  {
    request: { query: README_QUERY, variables: { repoId: 'repoid' } },
    result: {
      data: {
        node: {
          object: {
            text: '# Title',
            __typename: 'Blob',
          },
          __typename: 'Repository',
        },
      },
    },
  },
];

const onClose = jest.fn();

it('fetches data and renders markdown', async () => {
  const { findByText } = render(
    <MockedProvider mocks={mocks} addTypename={true}>
      <ReadmeModal open onClose={onClose} repoId="repoid" />
    </MockedProvider>
  );

  const title = await findByText('Title');
  expect(title.tagName).toBe('H1');
});
