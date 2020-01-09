import gql from 'graphql-tag';
import users from 'data/users.json';
import camelCase from 'lodash/camelCase';

export const USERS_QUERY = gql`
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
