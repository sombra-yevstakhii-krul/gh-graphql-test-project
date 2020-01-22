import React from 'react';
import { USER_REPOS_QUERY } from 'queries/user';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import UserRepos from './UserRepos';
import 'mocks/matchMedia.mock';

const mocks = [
  {
    request: {
      query: USER_REPOS_QUERY,
      variables: {
        login: 'sombra-ivan-arabchuk',
      },
    },
    result: {
      data: {
        user: {
          id: 'MDQ6VXNlcjMwNTIxMzk5',
          avatarUrl: 'https://avatars0.githubusercontent.com/u/30521399?s=55&v=4',
          followers: { totalCount: 0, __typename: 'FollowerConnection' },
          repositories: {
            nodes: [
              {
                issues: { totalCount: 0, __typename: 'IssueConnection' },
                forkCount: 0,
                id: 'MDEwOlJlcG9zaXRvcnkyMTkwMTI1NjM=',
                stargazers: { totalCount: 0, __typename: 'StargazerConnection' },
                viewerHasStarred: false,
                viewerSubscription: 'UNSUBSCRIBED',
                watchers: { totalCount: 2, __typename: 'UserConnection' },
                descriptionHTML: '<div></div>',
                name: 'cowellness',
                __typename: 'Repository',
              },
            ],
            __typename: 'RepositoryConnection',
          },
          login: 'sombra-ivan-arabchuk',
          viewerIsFollowing: false,
          __typename: 'User',
        },
      },
    },
  },
];

const setHeight = jest.fn();

it('receives correct data', async () => {
  const { findByText } = render(
    <MockedProvider mocks={mocks} addTypename={true}>
      <UserRepos login="sombra-ivan-arabchuk" setHeight={setHeight} height={500} phase="update" />
    </MockedProvider>
  );

  const repoName = await findByText('cowellness');
  expect(repoName).toBeInTheDocument();
});
