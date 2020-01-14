import gql from 'graphql-tag';

export const README_QUERY = gql`
  query UserRepos($repoId: ID!) {
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
