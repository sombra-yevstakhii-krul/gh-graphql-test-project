import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import client from 'graphql/client';
import Login from 'components/Login/Login';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#2196F3' },
  },
});

const App: React.FC = () => {
  const cachedToken = localStorage.getItem('token');
  const urlCode = new URLSearchParams(window.location.search).get('code');

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Login open={!cachedToken && !urlCode} />
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
