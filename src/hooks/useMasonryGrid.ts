import { useState, RefObject, useLayoutEffect } from 'react';
import { useTransition, ItemTransition } from 'react-spring';
import useMeasure from 'hooks/useMeasure';
import find from 'lodash/find';
import forEach from 'lodash/forEach';

const columnsCountByQuery: { [query: string]: number } = {
  '(min-width: 1100px)': 3,
  '(max-width: 1099px) and (min-width: 768px)': 2,
  '(max-width: 767px)': 1,
};

const calcColumnsCount = (
  itemsCount: number,
  queries: { [query: string]: number },
  media?: string
): number =>
  Math.min(
    find(queries, (_, query) => (media ? query === media : window.matchMedia(query).matches)) || 3,
    itemsCount
  );

export type Transitions = ItemTransition<{
  login: string;
  left: number;
  top: number;
  width: number;
  height: number;
}>[];

export default function useMasonryGrid(
  items: string[]
): {
  transitions: Transitions;
  measureRef: RefObject<HTMLDivElement>;
  setItemHeight: (i: string) => (value: number) => void;
  columnsHeights: number[];
  itemsHeights: { [user: string]: number };
} {
  const [measureRef, { width: containerWidth }] = useMeasure();

  const [itemsHeights, setItemsHeights] = useState<{ [user: string]: number }>({});
  const setItemHeight = (i: string) => (value: number): void => {
    setItemsHeights(prevHeights => ({ ...prevHeights, [i]: value }));
  };

  const [columnsCount, setColumnsCount] = useState<number>(
    calcColumnsCount(items.length, columnsCountByQuery)
  );

  useLayoutEffect(() => {
    const newColumnsCount = calcColumnsCount(items.length, columnsCountByQuery);
    if (columnsCount !== newColumnsCount) setColumnsCount(newColumnsCount);

    const queryChangeHandler = (e: MediaQueryListEvent): void => {
      if (e.matches) setColumnsCount(calcColumnsCount(items.length, columnsCountByQuery, e.media));
    };

    forEach(columnsCountByQuery, (_, query) => {
      window.matchMedia(query).addListener(queryChangeHandler);
    });

    return (): void => {
      forEach(columnsCountByQuery, (_, query) => {
        window.matchMedia(query).removeListener(queryChangeHandler);
      });
    };
  }, [columnsCount, items.length]);

  const columnsHeights = Array(columnsCount).fill(0);
  const gridItems = items.map(child => {
    const columnIndex = columnsHeights.indexOf(Math.min(...columnsHeights));
    // Basic masonry-grid placing, puts tile into the smallest column using Math.min

    const left = (containerWidth / columnsCount) * columnIndex;
    const top = columnsHeights[columnIndex];
    columnsHeights[columnIndex] += itemsHeights[child] + 30 || 0;
    // X = container width / number of columns * column index, Y = height of the
    // current column + 30px margin

    return {
      login: child,
      left,
      top,
      width: containerWidth / columnsCount,
      height: itemsHeights[child] || 0,
    };
  });

  const transitions = useTransition(gridItems, (item: { login: string }) => item.login, {
    from: ({ left, top, width, height }) => ({ left, top, width, height, opacity: 0 }),
    enter: ({ left, top, width, height }) => ({ left, top, width, height, opacity: 1 }),
    update: ({ left, top, width, height }) => ({ left, top, width, height }),
    leave: { height: 0, opacity: 0 },
    config: { mass: 1, tension: 500, friction: 40 },
    trail: 25,
  });

  return { transitions, measureRef, setItemHeight, columnsHeights, itemsHeights };
}
