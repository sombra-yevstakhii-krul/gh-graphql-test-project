import gql from 'graphql-tag';

export const USERS_AVATARS_QUERY = gql`
  query usersAvatarsQuery($login: String!) {
    user(login: $login) {
      avatarUrl(size: 55)
    }
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
