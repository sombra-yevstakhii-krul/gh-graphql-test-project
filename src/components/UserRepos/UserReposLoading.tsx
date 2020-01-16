import React from 'react';
import styled from 'styled-components';
import { Box, Grid } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

const RoundedSkeleton = styled(Skeleton).attrs({ variant: 'rect' })`
  border-radius: 50px;
`;

const UserReposLoading: React.FC = () => (
  <Box p={3} mb={3} overflow="hidden">
    <Grid container spacing={2} direction="column">
      <Grid item container spacing={2} wrap="nowrap">
        <Grid item>
          <Skeleton variant="circle" width={55} height={55} />
        </Grid>
        <Grid item>
          <Skeleton width={190} height={30} />
          <RoundedSkeleton width={100} height={20} />
        </Grid>
      </Grid>
      <Skeleton width={135} height={18} />
      <Skeleton width={250} height={12} />
      <Skeleton width={280} height={12} />
      <Skeleton width={90} height={12} />
      <Grid item container spacing={2} wrap="nowrap">
        <Grid item>
          <RoundedSkeleton width={115} height={34} />
        </Grid>
        <Grid item>
          <RoundedSkeleton width={125} height={34} />
        </Grid>
      </Grid>
      <Grid item container spacing={2} wrap="nowrap">
        <Grid item>
          <RoundedSkeleton width={90} height={34} />
        </Grid>
        <Grid item>
          <RoundedSkeleton width={95} height={34} />
        </Grid>
      </Grid>
    </Grid>
  </Box>
);

export default UserReposLoading;
