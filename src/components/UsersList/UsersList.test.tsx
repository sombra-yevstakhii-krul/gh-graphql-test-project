import React from 'react';
import { USERS_AVATARS_QUERY } from 'queries/user';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import UsersList from 'components/UsersList/UsersList';

const mocks = [
  {
    request: { query: USERS_AVATARS_QUERY, variables: { login: 'sombra-yuriy' } },
    result: {
      data: {
        user: {
          avatarUrl: 'https://avatars2.githubusercontent.com/u/43397550?s=55&v=4',
          login: 'sombra-yuriy',
        },
      },
    },
  },
];

const toggleSelectedUser = jest.fn();

it('shows correct avatar', async () => {
  const { findByText } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <UsersList selectedUsers={[]} toggleSelectedUser={toggleSelectedUser} />
    </MockedProvider>
  );

  const chip = (await findByText('sombra-yuriy')).parentElement;
  const avatar = chip?.querySelector('img');
  expect(avatar).toHaveAttribute(
    'src',
    'https://avatars2.githubusercontent.com/u/43397550?s=55&v=4'
  );
});
