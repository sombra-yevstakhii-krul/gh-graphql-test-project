import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, Typography, Box } from '@material-ui/core';
import { ReactComponent as GithubIcon } from 'assets/img/icons/github-icon.svg';
import config from 'utils/config';

interface PropTypes {
  open: boolean;
}

const Login: React.FC<PropTypes> = ({ open }) => {
  return (
    <Dialog open={open}>
      <Box px={15} py={4}>
        <Box pb={4}>
          <GithubIcon />
        </Box>
        <Typography
          component="a"
          variant="h4"
          align="center"
          display="block"
          color="primary"
          // eslint-disable-next-line max-len
          href={`https://github.com/login/oauth/authorize?client_id=${config.githubClientId}&scope=repo%20user`}
        >
          Login using github
        </Typography>
      </Box>
    </Dialog>
  );
};

export default Login;
