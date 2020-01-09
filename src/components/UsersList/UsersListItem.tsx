import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Chip, Avatar } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import styled from 'styled-components';
import { USERS_QUERY } from 'queries/user';
import camelCase from 'lodash/camelCase';

const StyledChip = withTheme(styled(Chip)`
  margin: 20px;
  font-size: 14px;
  color: ${(props): string => props.theme.palette?.text?.secondary};
  &.MuiChip-colorPrimary {
    color: #eeeeee;
  }
  .MuiAvatar-root.MuiChip-avatar {
    margin-left: 0;
    width: 32px;
    height: 32px;
  }
`);

const LoadingChip = styled(StyledChip).attrs({ color: 'default', avatar: <Avatar /> })`
  .MuiChip-label {
    width: 120px;
  }
`;

interface PropTypes {
  login: string;
  selected: boolean;
  onClick: () => void;
}

const UsersListItem: React.FC<PropTypes> = ({ login, selected, onClick }) => {
  const { data, loading } = useQuery(USERS_QUERY);

  return loading ? (
    <LoadingChip />
  ) : (
    <StyledChip
      color={selected ? 'primary' : 'default'}
      avatar={<Avatar src={data?.[camelCase(login)]?.avatarUrl} />}
      label={loading ? '' : login}
      onClick={onClick}
    />
  );
};

export default UsersListItem;
