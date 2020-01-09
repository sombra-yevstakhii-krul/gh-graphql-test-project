import React from 'react';
import users from 'data/users.json';
import UsersListItem from './UsersListItem';
import { Box } from '@material-ui/core';

interface PropTypes {
  selectedUsers: string[];
  toggleSelectedUser: (user: string) => void;
}

const UsersList: React.FC<PropTypes> = ({ selectedUsers, toggleSelectedUser }) => {
  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
      maxWidth={900}
      width="90%"
      mt={7}
      mb={12}
    >
      {users.map(user => (
        <UsersListItem
          login={user}
          selected={selectedUsers.includes(user)}
          onClick={(): void => toggleSelectedUser(user)}
          key={user}
        />
      ))}
    </Box>
  );
};

export default UsersList;
