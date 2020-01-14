import React, { useState } from 'react';
import { useTransition, animated, to } from 'react-spring';
import useMeasure from 'utils/useMeasure';
import styled from 'styled-components';
import UserRepos from 'components/UserRepos/UserRepos';

const List = styled.div`
  position: relative;
  width: 100%;
  max-width: 1024px;
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
  const [measureRef, { width: containerWidth }] = useMeasure();

  const [itemsHeights, setItemsHeights] = useState<{ [user: string]: number }>({});
  const setItemHeight = (i: string) => (value: number): void => {
    setItemsHeights(prevHeights => ({ ...prevHeights, [i]: value }));
  };

  const columnsHeights = [0, 0, 0];
  const gridItems = selectedUsers.map(child => {
    const columnIndex = columnsHeights.indexOf(Math.min(...columnsHeights));
    // Basic masonry-grid placing, puts tile into the smallest column using Math.min

    const left = (containerWidth / 3) * columnIndex;
    const top = columnsHeights[columnIndex];
    columnsHeights[columnIndex] += itemsHeights[child] || 0;
    // X = container width / number of columns * column index, Y = height of the current column

    return { login: child, left, top, width: containerWidth / 3, height: itemsHeights[child] || 0 };
  });

  const transitions = useTransition(gridItems, (item: { login: string }) => item.login, {
    from: ({ left, top, width, height }) => ({ left, top, width, height, opacity: 0 }),
    enter: ({ left, top, width, height }) => ({ left, top, width, height, opacity: 1 }),
    update: ({ left, top, width, height }) => ({ left, top, width, height }),
    leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25,
  });

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
