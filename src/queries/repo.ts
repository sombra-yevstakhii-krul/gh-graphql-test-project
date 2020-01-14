import gql from 'graphql-tag';

export const README_QUERY = gql`
  query readme($repoId: ID!) {
    node(id: $repoId) {
      ... on Repository {
        object(expression: "HEAD:README.md") {
          ... on Blob {
            text
          }
        }
      }
    }
  }
`;

export const ADD_STAR_MUTATION = gql`
  mutation addStar($repoId: ID!) {
    addStar(input: { starrableId: $repoId }) {
      starrable {
        viewerHasStarred
      }
    }
  }
`;

export const REMOVE_STAR_MUTATION = gql`
  mutation removeStar($repoId: ID!) {
    removeStar(input: { starrableId: $repoId }) {
      starrable {
        viewerHasStarred
      }
    }
  }
`;

export const SUBSCRIPTION_MUTATION = gql`
  mutation subscribe($repoId: ID!, $state: SubscriptionState!) {
    updateSubscription(input: { subscribableId: $repoId, state: $state }) {
      subscribable {
        viewerSubscription
      }
    }
  }
`;

export const FOLLOW_USER_MUTATION = gql`
  mutation followUser($userId: ID!) {
    followUser(input: { userId: $userId }) {
      user {
        viewerIsFollowing
      }
      clientMutationId
    }
  }
`;

export const UNFOLLOW_USER_MUTATION = gql`
  mutation unfollowUser($userId: ID!) {
    unfollowUser(input: { userId: $userId }) {
      user {
        viewerIsFollowing
      }
      clientMutationId
    }
  }
`;
