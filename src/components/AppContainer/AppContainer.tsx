import React, { useState, useCallback } from 'react';
import users from 'data/users.json';
import UsersList from 'components/UsersList/UsersList';
import without from 'lodash/without';
import { Box } from '@material-ui/core';

const AppContainer: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState(users.filter(() => Math.random() > 0.5));
  const toggleSelectedUser = useCallback(user => {
    setSelectedUsers(prevSelectedUsers => {
      if (prevSelectedUsers.includes(user)) {
        return without(prevSelectedUsers, user);
      } else {
        return [...prevSelectedUsers, user];
      }
    });
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <UsersList selectedUsers={selectedUsers} toggleSelectedUser={toggleSelectedUser} />
    </Box>
  );
};

export default AppContainer;
