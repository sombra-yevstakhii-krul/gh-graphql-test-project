import React, { useState, useEffect } from 'react';
import { NormalizedCacheObject, InMemoryCache, ApolloLink } from 'apollo-boost';
import { PersistentStorage, PersistedData } from 'apollo-cache-persist/types';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { Observable } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { toast, ToastId } from 'react-toastify';
import config from 'data/config';
import { persistCache } from 'apollo-cache-persist';

const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql',
});

const errorLink = onError(
  ({ networkError, operation, forward }) =>
    new Observable(observer => {
      if (networkError) {
        window.addEventListener(
          'online',
          (): void => {
            const subscriber = {
              next: observer.next.bind(observer),
            };
            forward(operation).subscribe(subscriber);
          },
          { once: true }
        );
      }
    })
);

let tokenPromise: Promise<string | void> | undefined;
// Each request made before the token is fetched will run only after the promise finishes

const authLink = setContext(
  (_, { headers }) =>
    new Promise(resolve => {
      // Async/await wouldn't suffice because useQuery hooks should return loading: true until
      // token is fetched, which is achivable only if this promise never resolves without token
      const token = localStorage.getItem('token');
      const resolveToken = (token: string | void): string | void => {
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
          .then(({ token: newToken }): string | void => {
            if (!newToken) throw new Error();
            localStorage.setItem('token', newToken);
            return resolveToken(newToken);
          })
          .catch(() => {
            toast.error("Couldn't login!");
          })
          .finally(() => {
            window.history.replaceState({}, '', window.location.pathname);
          });
      }
    })
);

const cache = new InMemoryCache();
const link = ApolloLink.from([errorLink, authLink, httpLink]);

const ClientProvider: React.FC = ({ children }) => {
  const [client, setClient] = useState();

  useEffect(() => {
    persistCache({
      cache,
      storage: window.localStorage as PersistentStorage<PersistedData<NormalizedCacheObject>>,
    }).then(() => {
      setClient(
        new ApolloClient({
          link,
          cache,
        })
      );
    });

    let offlineToastId: ToastId;
    const onOffline = (): void => {
      offlineToastId = toast.error('You are offline!', { autoClose: false });
    };
    const onOnline = (): void => {
      toast.update(offlineToastId, {
        render: 'You are back online!',
        type: toast.TYPE.SUCCESS,
        autoClose: 4000,
      });
    };

    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);

    return (): void => {
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
    };
  }, []);

  if (!client) return null;

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ClientProvider;
