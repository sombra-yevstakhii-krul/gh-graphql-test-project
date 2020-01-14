import React, { useLayoutEffect } from 'react';
import { Paper } from '@material-ui/core';
import useMeasure from 'utils/useMeasure';
import { TransitionPhase } from 'react-spring';

interface PropTypes {
  login: string;
  setHeight: (value: number) => void;
  height: number;
  phase: TransitionPhase;
}

const UserRepos: React.FC<PropTypes> = ({ login, setHeight, height: prevHeight, phase }) => {
  const [ref, { height }] = useMeasure();

  useLayoutEffect(() => {
    if (prevHeight !== height && phase === 'update') {
      setHeight(height);
    }
  }, [height, phase, prevHeight, setHeight]);

  return <Paper ref={ref}>{login}</Paper>;
};

export default UserRepos;
