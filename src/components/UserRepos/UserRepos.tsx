import React, { useLayoutEffect, Fragment, useState } from 'react';
import { Paper, Box, Grid, Avatar, Typography, Chip, Button, Divider } from '@material-ui/core';
import useMeasure from 'utils/useMeasure';
import { TransitionPhase } from 'react-spring';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { USER_REPOS_QUERY, UserReposQuery, UserReposVars } from 'queries/user';
import { Add, Remove } from '@material-ui/icons';
import styled from 'styled-components';
import ReadmeModal from 'components/ReadmeModal/ReadmeModal';
import {
  REMOVE_STAR_MUTATION,
  ADD_STAR_MUTATION,
  UNFOLLOW_USER_MUTATION,
  SUBSCRIPTION_MUTATION,
  FOLLOW_USER_MUTATION,
} from 'queries/repo';
import UserReposLoading from 'components/UserRepos/UserReposLoading';

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
    pollInterval: 60000,
  });

  const [addStar] = useMutation(ADD_STAR_MUTATION, {
    refetchQueries: [{ query: USER_REPOS_QUERY, variables: { login } }],
  });
  const [removeStar] = useMutation(REMOVE_STAR_MUTATION, {
    refetchQueries: [{ query: USER_REPOS_QUERY, variables: { login } }],
  });
  const [followUser] = useMutation(FOLLOW_USER_MUTATION, {
    refetchQueries: [{ query: USER_REPOS_QUERY, variables: { login } }],
  });
  const [unfollowUser] = useMutation(UNFOLLOW_USER_MUTATION, {
    refetchQueries: [{ query: USER_REPOS_QUERY, variables: { login } }],
  });
  const [setSubscriptionStatus] = useMutation(SUBSCRIPTION_MUTATION, {
    refetchQueries: [{ query: USER_REPOS_QUERY, variables: { login } }],
  });

  const [ref, { height }] = useMeasure();

  const [readmeRepoId, setReadmeRepoId] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (prevHeight !== height && phase === 'update') {
      setHeight(height);
    }
  }, [height, phase, prevHeight, setHeight]);

  return (
    <Paper ref={ref}>
      {loading ? (
        <UserReposLoading />
      ) : (
        <>
          <ReadmeModal
            open={!!readmeRepoId}
            repoId={readmeRepoId}
            onClose={(): void => setReadmeRepoId(null)}
          />
          <Box p={3} mb={3} overflow="hidden">
            <Grid container spacing={2} direction="column">
              <Grid item container spacing={2} wrap="nowrap">
                <Grid item>
                  <Avatar src={data?.user.avatarUrl}></Avatar>
                </Grid>
                <Grid item>
                  <Typography variant="h6">{data?.user.login}</Typography>
                  <Chip
                    label={`Follow (${data?.user.followers.totalCount})`}
                    icon={data?.user.viewerIsFollowing ? <Remove /> : <Add />}
                    color={data?.user.viewerIsFollowing ? 'primary' : 'default'}
                    onClick={(): void => {
                      data?.user.viewerIsFollowing
                        ? unfollowUser({ variables: { userId: data?.user.id } })
                        : followUser({ variables: { userId: data?.user.id } });
                    }}
                  />
                </Grid>
              </Grid>
              {data?.user.repositories.nodes.map((repo, i) => (
                <Fragment key={repo.id}>
                  {i !== 0 && <Divider />}
                  <Box pt={1} pb={3}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body1">{repo.name}</Typography>
                      <ReadmeButton
                        variant="text"
                        color="primary"
                        onClick={(): void => setReadmeRepoId(repo.id)}
                      >
                        View README.md
                      </ReadmeButton>
                    </Box>
                    <Box pt={1} pb={2}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        dangerouslySetInnerHTML={{ __html: repo.descriptionHTML }}
                      />
                    </Box>
                    <Grid item container spacing={2} wrap="nowrap">
                      <Grid item>
                        <Chip
                          label={`Stars (${repo.stargazers.totalCount})`}
                          icon={repo.viewerHasStarred ? <Remove /> : <Add />}
                          color={repo.viewerHasStarred ? 'primary' : 'default'}
                          onClick={(): void => {
                            repo.viewerHasStarred
                              ? removeStar({ variables: { repoId: repo.id } })
                              : addStar({ variables: { repoId: repo.id } });
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <Chip
                          label={`Watching (${repo.watchers.totalCount})`}
                          icon={repo.viewerSubscription === 'SUBSCRIBED' ? <Remove /> : <Add />}
                          color={repo.viewerSubscription === 'SUBSCRIBED' ? 'primary' : 'default'}
                          onClick={(): void => {
                            setSubscriptionStatus({
                              variables: {
                                repoId: repo.id,
                                state:
                                  repo.viewerSubscription === 'SUBSCRIBED'
                                    ? 'UNSUBSCRIBED'
                                    : 'SUBSCRIBED',
                              },
                            });
                          }}
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
        </>
      )}
    </Paper>
  );
};

export default UserRepos;
