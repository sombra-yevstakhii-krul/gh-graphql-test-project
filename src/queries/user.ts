import gql from 'graphql-tag';
import users from 'data/users.json';
import camelCase from 'lodash/camelCase';

export const USERS_AVATARS_QUERY = gql`
  query usersQuery {
    ${users.map(
      // github doesn't support batched requests and kebab-case keys, so maping through the logins
      // and turning them to camelCase is the only way to avoid sending all the requests at once
      user => `
      ${camelCase(user)}: user(login: "${user}") {
        avatarUrl(size: 55)
      }
    `
    )}
  }
`;

export interface UserReposQuery {
  user: {
    id: string;
    avatarUrl: string;
    followers: {
      totalCount: number;
    };
    repositories: {
      nodes: Array<{
        issues: {
          totalCount: number;
        };
        forkCount: number;
        id: string;
        stargazers: {
          totalCount: number;
        };
        viewerHasStarred: boolean;
        viewerSubscription: 'SUBSCRIBED' | 'UNSUBSCRIBED' | 'IGNORED';
        watchers: {
          totalCount: number;
        };
        descriptionHTML: string;
        name: string;
      }>;
    };
    login: string;
    viewerIsFollowing: boolean;
  };
}

export interface UserReposVars {
  login: string;
}

export const USER_REPOS_QUERY = gql`
  query userRepos($login: String!) {
    user(login: $login) {
      id
      avatarUrl(size: 55)
      followers {
        totalCount
      }
      repositories(last: 10) {
        nodes {
          issues {
            totalCount
          }
          forkCount
          id
          stargazers {
            totalCount
          }
          viewerHasStarred
          viewerSubscription
          watchers {
            totalCount
          }
          descriptionHTML
          name
        }
      }
      login
      viewerIsFollowing
    }
  }
`;
