import React, {
  memo,
  useMemo,
} from "react";

import { useDrop } from "react-dnd";

import cx from "classnames";

import {
  Column,
  ColumnData,
  ColumnResizeEvent,
  DateSetup,
  Distances,
  Icons,
  Task,
  TaskOrEmpty,
} from "../../types/public-types";

import styles from "./task-list-table-row.module.css";
import { ROW_DRAG_TYPE } from "../../constants";

type TaskListTableRowProps = {
  canMoveTasks: boolean;
  dateSetup: DateSetup;
  depth: number;
  distances: Distances;
  task: TaskOrEmpty;
  fullRowHeight: number;
  handleAddTask: (task: Task) => void;
  handleEditTask: (task: TaskOrEmpty) => void;
  handleMoveTaskAfter: (target: TaskOrEmpty, taskForMove: TaskOrEmpty) => void;
  handleMoveTaskInside: (parent: Task, child: TaskOrEmpty) => void;
  hasChildren: boolean;
  icons?: Partial<Icons>;
  columns: readonly Column[];
  columnResizeEvent: ColumnResizeEvent | null;
  indexStr: string;
  isClosed: boolean;
  isShowTaskNumbers: boolean;
  onExpanderClick: (task: Task) => void;
  handleDeteleTask: (task: TaskOrEmpty) => void;
};

const TaskListTableRowInner: React.FC<TaskListTableRowProps> = ({
  canMoveTasks,
  dateSetup,
  depth,
  distances,
  task,
  fullRowHeight,
  handleAddTask,
  handleEditTask,
  handleMoveTaskAfter,
  handleMoveTaskInside,
  hasChildren,
  icons = undefined,
  columns,
  columnResizeEvent,
  indexStr,
  isClosed,
  isShowTaskNumbers,
  onExpanderClick,
  handleDeteleTask,
}) => {
  const {
    id,
    comparisonLevel = 1,
  } = task;

  const [dropInsideProps, dropInside] = useDrop({
    accept: ROW_DRAG_TYPE,
    
    drop: (item: TaskOrEmpty, monitor) => {
      if (
        monitor.didDrop()
        || task.type === "empty"
        || task.type === "milestone"
      ) {
        return;
      }

      handleMoveTaskInside(task, item);
    },

    canDrop: (item: TaskOrEmpty) => item.id !== id
      || (item.comparisonLevel || 1) !== comparisonLevel,

    collect: (monitor) => ({
      isLighten: monitor.canDrop() && monitor.isOver(),
    }),
  }, [id, comparisonLevel, handleMoveTaskInside, task]);

  const [dropAfterProps, dropAfter] = useDrop({
    accept: ROW_DRAG_TYPE,
    
    drop: (item: TaskOrEmpty) => {
      handleMoveTaskAfter(task, item);
    },

    collect: (monitor) => ({
      isLighten: monitor.isOver(),
    }),
  }, [id, comparisonLevel, handleMoveTaskAfter, task]);

  const columnData: ColumnData = useMemo(() => ({
    canMoveTasks,
    dateSetup,
    depth,
    distances,
    handleDeteleTask,
    handleAddTask,
    handleEditTask,
    hasChildren,
    icons,
    indexStr,
    isClosed,
    isShowTaskNumbers,
    onExpanderClick,
    task,
  }), [
    canMoveTasks,
    dateSetup,
    depth,
    distances,
    handleDeteleTask,
    handleAddTask,
    handleEditTask,
    hasChildren,
    icons,
    indexStr,
    isClosed,
    isShowTaskNumbers,
    onExpanderClick,
    task,
  ]);

  return (
    <div
      className={cx(styles.taskListTableRow, {
        [styles.taskListTableRowLighten]: dropInsideProps.isLighten
          && !dropAfterProps.isLighten,
      })}
      style={{
        height: fullRowHeight,
      }}
      ref={dropInside}
    >
      {columns.map(({
        component: Component,
        width,
      }, index) => {
        const columnWidth = columnResizeEvent && columnResizeEvent.columnIndex === index
          ? Math.max(5, width + columnResizeEvent.endX - columnResizeEvent.startX)
          : width;

        return (
          <div
            className={styles.taskListCell}
            style={{
              minWidth: columnWidth,
              maxWidth: columnWidth,
            }}
            key={index}
          >
            <Component
              data={columnData}
            />
          </div>
        );
      })}

      {dropInsideProps.isLighten && (
        <div
          className={cx(styles.dropAfter, {
            [styles.dropAfterLighten]: dropAfterProps.isLighten,
          })}
          ref={dropAfter}
        />
      )}
    </div>
  );
};

export const TaskListTableRow = memo(TaskListTableRowInner);