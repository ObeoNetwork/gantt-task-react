import {
  useCallback,
  useRef,
  useState,
} from 'react';
import type {
  RefObject,
  SyntheticEvent,
} from 'react';

export const useVerticalScrollbars = (): [
  RefObject<HTMLDivElement>,
  RefObject<HTMLDivElement>,
  RefObject<HTMLDivElement>,
  number,
  (nextScrollY: number) => void,
  (event: SyntheticEvent<HTMLDivElement>) => void,
] => {
  const [scrollY, setScrollY] = useState(0);

  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const taskListContainerRef = useRef<HTMLDivElement>(null);
  const verticalScrollbarRef = useRef<HTMLDivElement>(null);

  const isLockedRef = useRef(false);

  const setScrollYProgrammatically = useCallback((nextScrollY: number) => {
    isLockedRef.current = true;

    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = nextScrollY;
    }

    if (taskListContainerRef.current) {
      taskListContainerRef.current.scrollTop = nextScrollY;
    }

    if (verticalScrollbarRef.current) {
      verticalScrollbarRef.current.scrollTop = nextScrollY;
    }

    setScrollY(nextScrollY);

    setTimeout(() => {
      isLockedRef.current = false;
    }, 300);
  }, []);

  const onVerticalScrollbarScrollY = useCallback((event: SyntheticEvent<HTMLDivElement>) => {
    if (isLockedRef.current) {
      return;
    }

    const nextScrollY = event.currentTarget.scrollTop;

    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = nextScrollY;
    }

    if (taskListContainerRef.current) {
      taskListContainerRef.current.scrollTop = nextScrollY;
    }

    setScrollY(nextScrollY);
  }, []);

  return [
    horizontalContainerRef,
    taskListContainerRef,
    verticalScrollbarRef,
    scrollY,
    setScrollYProgrammatically,
    onVerticalScrollbarScrollY,
  ];
};
