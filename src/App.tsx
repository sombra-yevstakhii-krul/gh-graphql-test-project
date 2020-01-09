import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import client from 'graphql/client';
import Login from 'components/Login/Login';
import { createMuiTheme, ThemeProvider, StylesProvider } from '@material-ui/core';
import AppContainer from 'components/AppContainer/AppContainer';
import { createGlobalStyle } from 'styled-components';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#2196F3' },
  },
});

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    background-color: #EEEEEE;
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const App: React.FC = () => {
  const cachedToken = localStorage.getItem('token');
  const urlCode = new URLSearchParams(window.location.search).get('code');

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <StylesProvider injectFirst>
          <Login open={!cachedToken && !urlCode} />
          <AppContainer />
          <GlobalStyles />
        </StylesProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
