import React, { useLayoutEffect, Fragment } from 'react';
import { Paper, Box, Grid, Avatar, Typography, Chip, Button, Divider } from '@material-ui/core';
import useMeasure from 'utils/useMeasure';
import { TransitionPhase } from 'react-spring';
import { useQuery } from '@apollo/react-hooks';
import { USER_REPOS_QUERY, UserReposQuery, UserReposVars } from 'queries/user';
import { Skeleton } from '@material-ui/lab';
import { Add } from '@material-ui/icons';
import styled from 'styled-components';

const RoundedSkeleton = styled(Skeleton).attrs({ variant: 'rect' })`
  border-radius: 50px;
`;

const ReadmeButton = styled(Button)`
  font-weight: normal;
`;

interface PropTypes {
  login: string;
  setHeight: (value: number) => void;
  height: number;
  phase: TransitionPhase;
}

const UserRepos: React.FC<PropTypes> = ({ login, setHeight, height: prevHeight, phase }) => {
  const { data, loading } = useQuery<UserReposQuery, UserReposVars>(USER_REPOS_QUERY, {
    variables: { login },
  });

  const [ref, { height }] = useMeasure();

  useLayoutEffect(() => {
    if (prevHeight !== height && phase === 'update') {
      setHeight(height);
    }
  }, [height, phase, prevHeight, setHeight]);

  if (loading)
    return (
      <Paper ref={ref}>
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
      </Paper>
    );

  return (
    <Paper ref={ref}>
      <Box p={3} mb={3} overflow="hidden">
        <Grid container spacing={2} direction="column">
          <Grid item container spacing={2} wrap="nowrap">
            <Grid item>
              <Avatar src={data?.user.avatarUrl}></Avatar>
            </Grid>
            <Grid item>
              <Typography variant="body1">{data?.user.login}</Typography>
              <Chip
                label={`Follow (${data?.user.followers.totalCount})`}
                icon={<Add />}
                color={data?.user.viewerIsFollowing ? 'primary' : 'default'}
              />
            </Grid>
          </Grid>
          {data?.user.repositories.nodes.map((repo, i) => (
            <Fragment key={repo.id}>
              {i !== 0 && <Divider />}
              <Box pt={1} pb={3}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6">{repo.name}</Typography>
                  <ReadmeButton variant="text" color="primary">
                    View README.md
                  </ReadmeButton>
                </Box>
                <div dangerouslySetInnerHTML={{ __html: repo.descriptionHTML }} />
                <Grid item container spacing={2} wrap="nowrap">
                  <Grid item>
                    <Chip
                      label={`Stars (${repo.stargazers.totalCount})`}
                      icon={<Add />}
                      color={repo.viewerHasStarred ? 'primary' : 'default'}
                    />
                  </Grid>
                  <Grid item>
                    <Chip
                      label={`Watching (${repo.watchers.totalCount})`}
                      icon={<Add />}
                      color={repo.viewerSubscription === 'SUBSCRIBED' ? 'primary' : 'default'}
                    />
                  </Grid>
                </Grid>
                <Grid item container spacing={2} wrap="nowrap">
                  <Grid item>
                    <Chip label={`Issues (${repo.issues.totalCount})`} />
                  </Grid>
                  <Grid item>
                    <Chip label={`Forks (${repo.forkCount})`} />
                  </Grid>
                </Grid>
              </Box>
            </Fragment>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default UserRepos;
