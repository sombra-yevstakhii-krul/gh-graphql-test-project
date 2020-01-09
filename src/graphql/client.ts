import { InMemoryCache } from 'apollo-boost';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import config from 'data/config';

const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql',
});

let tokenPromise: Promise<string | null> | undefined;
// Each request made before the token is fetched will run only after the promise finishes

const authLink = setContext(
  (_, { headers }) =>
    new Promise(resolve => {
      // Async/await wouldn't suffice because useQuery hooks should return loading: true until
      // token is fetched, which is achivable only if this promise never resolves without token
      const token = localStorage.getItem('token');
      const resolveToken = (token: string | null): string | null => {
        resolve({
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
          },
        });
        return token;
      };
      if (token) {
        resolveToken(token);
      } else if (tokenPromise) {
        tokenPromise.then(resolveToken);
      } else {
        const code = new URLSearchParams(window.location.search).get('code');
        if (!code) return;
        // gatekeeper is needed due to https://github.com/isaacs/github/issues/330
        tokenPromise = fetch(`${config.gatekeeperUrl}/authenticate/${code}`)
          .then(res => res.json())
          .then(({ token: newToken }): string | null => {
            if (!newToken) return null; // TODO: Add proper error handling
            localStorage.setItem('token', newToken);
            window.history.replaceState({}, '', window.location.pathname);
            return resolveToken(newToken);
          });
      }
    })
);

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
