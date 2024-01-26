import React, { memo, useEffect } from "react";
import type { ComponentType, MouseEvent, RefObject } from "react";

import { useDrop } from "react-dnd";

import {
  ChildByLevelMap,
  ColorStyles,
  Column,
  DateSetup,
  DependencyMap,
  Distances,
  Icons,
  MapTaskToNestedIndex,
  Task,
  TaskListHeaderProps,
  TaskListTableProps,
  TaskOrEmpty,
} from "../../types/public-types";

import { ROW_DRAG_TYPE } from "../../constants";
import { useOptimizedList } from "../../helpers/use-optimized-list";

import styles from "./task-list.module.css";

const SCROLL_DELAY = 25;

export type TaskListProps = {
  canMoveTasks: boolean;
  canResizeColumns: boolean;
  childTasksMap: ChildByLevelMap;
  closedTasks: Readonly<Record<string, true>>;
  colors: ColorStyles;
  columns: readonly Column[];
  cutIdsMirror: Readonly<Record<string, true>>;
  dateSetup: DateSetup;
  dependencyMap: DependencyMap;
  distances: Distances;
  fontFamily: string;
  fontSize: string;
  fullRowHeight: number;
  ganttFullHeight: number;
  ganttHeight: number;
  getTaskCurrentState: (task: Task) => Task;
  handleAddTask: (task: Task) => void;
  handleDeleteTasks: (task: TaskOrEmpty[]) => void;
  handleEditTask: (task: TaskOrEmpty) => void;
  handleMoveTaskBefore: (target: TaskOrEmpty, taskForMove: TaskOrEmpty) => void;
  handleMoveTaskAfter: (target: TaskOrEmpty, taskForMove: TaskOrEmpty) => void;
  handleMoveTasksInside: (parent: Task, childs: readonly TaskOrEmpty[]) => void;
  handleOpenContextMenu: (
    task: TaskOrEmpty,
    clientX: number,
    clientY: number
  ) => void;
  icons?: Partial<Icons>;
  isShowTaskNumbers: boolean;
  mapTaskToNestedIndex: MapTaskToNestedIndex;
  onColumnResizeStart: (columnIndex: number, clientX: number) => void;
  onExpanderClick: (task: Task) => void;
  onTableResizeStart: (clientX: number) => void;
  scrollToBottomStep: () => void;
  scrollToTask: (task: Task) => void;
  scrollToTopStep: () => void;
  selectTaskOnMouseDown: (taskId: string, event: MouseEvent) => void;
  selectedIdsMirror: Readonly<Record<string, true>>;
  tableWidth: number;
  taskListContainerRef: RefObject<HTMLDivElement>;
  taskListRef: RefObject<HTMLDivElement>;
  taskListWidth: number;
  tasks: readonly TaskOrEmpty[];
  TaskListHeader: ComponentType<TaskListHeaderProps>;
  TaskListTable: ComponentType<TaskListTableProps>;
};

const TaskListInner: React.FC<TaskListProps> = ({
  canMoveTasks,
  canResizeColumns,
  childTasksMap,
  closedTasks,
  colors,
  columns,
  cutIdsMirror,
  dateSetup,
  dependencyMap,
  distances,
  fontFamily,
  fontSize,
  fullRowHeight,
  ganttFullHeight,
  ganttHeight,
  getTaskCurrentState,
  handleAddTask,
  handleDeleteTasks,
  handleEditTask,
  handleMoveTaskBefore,
  handleMoveTaskAfter,
  handleMoveTasksInside,
  handleOpenContextMenu,
  icons = undefined,
  isShowTaskNumbers,
  mapTaskToNestedIndex,
  onColumnResizeStart,
  onExpanderClick,
  onTableResizeStart,
  scrollToBottomStep,
  scrollToTask,
  scrollToTopStep,
  selectTaskOnMouseDown,
  selectedIdsMirror,
  tableWidth,
  taskListContainerRef,
  taskListRef,
  taskListWidth,
  tasks,
  TaskListHeader,
  TaskListTable,
}) => {
  const renderedIndexes = useOptimizedList(
    taskListContainerRef,
    "scrollTop",
    fullRowHeight
  );

  const [{ isScrollingToTop }, scrollToTopRef] = useDrop(
    {
      accept: ROW_DRAG_TYPE,

      collect: monitor => ({
        isScrollingToTop: monitor.isOver(),
      }),

      canDrop: () => false,
    },
    []
  );

  const [{ isScrollingToBottom }, scrollToBottomRef] = useDrop(
    {
      accept: ROW_DRAG_TYPE,

      collect: monitor => ({
        isScrollingToBottom: monitor.isOver(),
      }),

      canDrop: () => false,
    },
    [scrollToBottomStep]
  );

  useEffect(() => {
    if (!isScrollingToTop) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      scrollToTopStep();
    }, SCROLL_DELAY);

    return () => {
      clearInterval(intervalId);
    };
  }, [isScrollingToTop, scrollToTopStep]);

  useEffect(() => {
    if (!isScrollingToBottom) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      scrollToBottomStep();
    }, SCROLL_DELAY);

    return () => {
      clearInterval(intervalId);
    };
  }, [isScrollingToBottom, scrollToBottomStep]);

  return (
    <div className={styles.taskListRoot} ref={taskListRef}>
      <div
        className={styles.taskListHorizontalScroll}
        style={{
          width: tableWidth,
        }}
      >
        <TaskListHeader
          headerHeight={distances.headerHeight}
          fontFamily={fontFamily}
          fontSize={fontSize}
          columns={columns}
          onColumnResizeStart={onColumnResizeStart}
          canResizeColumns={canResizeColumns}
        />

        <div className={styles.tableWrapper}>
          <div
            ref={taskListContainerRef}
            className={styles.horizontalContainer}
            style={{
              height: Math.max(
                ganttHeight,
                distances.minimumRowDisplayed * distances.rowHeight
              ),
              width: taskListWidth,
            }}
          >
            <div
              style={{
                height: Math.max(
                  ganttFullHeight,
                  distances.minimumRowDisplayed * distances.rowHeight
                ),
                backgroundSize: `100% ${fullRowHeight * 2}px`,
                backgroundImage: `linear-gradient(to bottom, transparent ${fullRowHeight}px, #f5f5f5 ${fullRowHeight}px)`,
              }}
            >
              <TaskListTable
                canMoveTasks={canMoveTasks}
                childTasksMap={childTasksMap}
                closedTasks={closedTasks}
                colors={colors}
                columns={columns}
                cutIdsMirror={cutIdsMirror}
                dateSetup={dateSetup}
                dependencyMap={dependencyMap}
                distances={distances}
                fontFamily={fontFamily}
                fontSize={fontSize}
                fullRowHeight={fullRowHeight}
                ganttFullHeight={ganttFullHeight}
                getTaskCurrentState={getTaskCurrentState}
                handleAddTask={handleAddTask}
                handleDeleteTasks={handleDeleteTasks}
                handleEditTask={handleEditTask}
                handleMoveTaskBefore={handleMoveTaskBefore}
                handleMoveTaskAfter={handleMoveTaskAfter}
                handleMoveTasksInside={handleMoveTasksInside}
                handleOpenContextMenu={handleOpenContextMenu}
                icons={icons}
                isShowTaskNumbers={isShowTaskNumbers}
                mapTaskToNestedIndex={mapTaskToNestedIndex}
                onExpanderClick={onExpanderClick}
                renderedIndexes={renderedIndexes}
                scrollToTask={scrollToTask}
                selectTaskOnMouseDown={selectTaskOnMouseDown}
                selectedIdsMirror={selectedIdsMirror}
                taskListWidth={taskListWidth}
                tasks={tasks}
              />
            </div>
          </div>

          <div
            className={`${styles.scrollToTop} ${
              !renderedIndexes || renderedIndexes[2] ? styles.hidden : ""
            }`}
            ref={scrollToTopRef}
          />

          <div
            className={`${styles.scrollToBottom} ${
              !renderedIndexes || renderedIndexes[3] ? styles.hidden : ""
            }`}
            ref={scrollToBottomRef}
          />
        </div>
      </div>

      <div
        className={styles.taskListResizer}
        onMouseDown={event => {
          onTableResizeStart(event.clientX);
        }}
        onTouchStart={event => {
          const firstTouch = event.touches[0];

          if (firstTouch) {
            onTableResizeStart(firstTouch.clientX);
          }
        }}
      />
    </div>
  );
};

export const TaskList = memo(TaskListInner);
