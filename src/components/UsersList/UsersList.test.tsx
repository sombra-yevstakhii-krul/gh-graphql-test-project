import React from 'react';
import { USERS_QUERY } from 'queries/user';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import UsersList from 'components/UsersList/UsersList';

const mocks = [
  {
    request: { query: USERS_QUERY },
    result: {
      data: {
        sombraPavloDaniv: {
          avatarUrl: 'https://avatars1.githubusercontent.com/u/30520581?s=55&v=4',
        },
        sombraDmytroMula: {
          avatarUrl: 'https://avatars0.githubusercontent.com/u/30520298?s=55&v=4',
        },
        sombraYuriy: {
          avatarUrl: 'https://avatars2.githubusercontent.com/u/43397550?s=55&v=4',
        },
        sombraOstryzhniukAndrii: {
          avatarUrl: 'https://avatars2.githubusercontent.com/u/32451407?s=55&v=4',
        },
        sombraRomanPolagiv: {
          avatarUrl: 'https://avatars3.githubusercontent.com/u/30521980?s=55&v=4',
        },
        sombraNazarOstryzhniuk: {
          avatarUrl: 'https://avatars2.githubusercontent.com/u/49642404?s=55&v=4',
        },
        sombraIvanArabchuk: {
          avatarUrl: 'https://avatars0.githubusercontent.com/u/30521399?s=55&v=4',
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
