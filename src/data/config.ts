const config = {
  githubClientId: process.env.REACT_APP_GITHUB_CLIENT_ID as string,
  githubClientSecret: process.env.REACT_APP_GITHUB_CLIENT_SECRET as string,
  gatekeeperUrl:
    process.env.REACT_APP_ENV === 'production'
      ? 'https://gh-graphql-test-project.herokuapp.com/'
      : 'http://localhost:9999',
};

export default config;
