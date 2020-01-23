import React from 'react';
import { animated, to } from 'react-spring';
import styled from 'styled-components';
import UserRepos from 'components/UserRepos/UserRepos';
import useMasonryGrid from 'hooks/useMasonryGrid';

const List = styled.div`
  position: relative;
  width: 100%;
  max-width: 1250px;
  height: 100%;
`;

const AnimatedItem = styled(animated.div)`
  position: absolute;
  will-change: transform, width, height, opacity;
  padding: 15px;
  box-sizing: border-box;
`;

interface PropTypes {
  selectedUsers: string[];
}

// The idea is taken from https://codesandbox.io/embed/26mjowzpr

const UserReposContainer: React.FC<PropTypes> = ({ selectedUsers }) => {
  const { transitions, measureRef, setItemHeight, columnsHeights, itemsHeights } = useMasonryGrid(
    selectedUsers
  );

  return (
    <List ref={measureRef} style={{ height: Math.max(...columnsHeights) }}>
      {transitions.map(({ item: { login }, props: { left, top, ...rest }, key, phase }) => (
        <AnimatedItem
          key={key}
          style={{
            transform: to([left, top], (x: number, y: number) => `translate3d(${x}px,${y}px,0)`),
            ...rest,
          }}
        >
          <UserRepos
            login={login}
            setHeight={setItemHeight(login)}
            phase={phase}
            height={itemsHeights[login]}
          />
        </AnimatedItem>
      ))}
    </List>
  );
};

export default UserReposContainer;
