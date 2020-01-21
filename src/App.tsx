import React from 'react';
import Login from 'components/Login/Login';
import { createMuiTheme, ThemeProvider, StylesProvider } from '@material-ui/core';
import AppContainer from 'components/AppContainer/AppContainer';
import { createGlobalStyle } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import ClientProvider from 'graphql/ClientProvider';

import 'react-toastify/dist/ReactToastify.min.css';

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
    <ClientProvider>
      <ThemeProvider theme={theme}>
        <StylesProvider injectFirst>
          <ToastContainer position="bottom-right" newestOnTop />
          <Login open={!cachedToken && !urlCode} />
          <AppContainer />
          <GlobalStyles />
        </StylesProvider>
      </ThemeProvider>
    </ClientProvider>
  );
};

export default App;
