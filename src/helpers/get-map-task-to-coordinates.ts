import {
  Distances,
  MapTaskToCoordinates,
  TaskToRowIndexMap,
  TaskCoordinates,
  TaskOrEmpty,
  Task,
} from "../types/public-types";
import { progressWithByParams } from "./bar-helper";
import { TimelineAxis, dateToX } from "./timeline-axis";

export const countTaskCoordinates = (
  task: Task,
  taskToRowIndexMap: TaskToRowIndexMap,
  axis: TimelineAxis,
  rtl: boolean,
  fullRowHeight: number,
  taskHeight: number,
  taskYOffset: number,
  distances: Distances,
  svgWidth: number
): TaskCoordinates => {
  const { columnWidth, rowHeight } = distances;

  const { id, comparisonLevel = 1, progress, type } = task;

  const indexesAtLevel = taskToRowIndexMap.get(comparisonLevel);

  if (!indexesAtLevel) {
    throw new Error(`Indexes at level ${comparisonLevel} are not found`);
  }

  const rowIndex = indexesAtLevel.get(id);

  if (typeof rowIndex !== "number") {
    throw new Error(`Row index for task ${id} is not found`);
  }

  const x1 = rtl
    ? svgWidth - dateToX(axis, task.end)
    : dateToX(axis, task.start);

  const x2 = rtl
    ? svgWidth - dateToX(axis, task.start)
    : dateToX(axis, task.end);

  const levelY = rowIndex * fullRowHeight + rowHeight * (comparisonLevel - 1);

  const y = levelY + taskYOffset;

  const [progressWidth, progressX] =
    type === "milestone"
      ? [0, x1]
      : progressWithByParams(x1, x2, progress, rtl);

  const taskX1 = type === "milestone" ? x1 - taskHeight * 0.5 : x1;

  const taskX2 = type === "milestone" ? x2 + taskHeight * 0.5 : x2;

  const taskWidth = type === "milestone" ? taskHeight : taskX2 - taskX1;

  const containerX = taskX1 - columnWidth;
  const containerWidth = svgWidth - containerX;

  const innerX1 = columnWidth;
  const innerX2 = columnWidth + taskWidth;

  return {
    containerWidth,
    containerX,
    innerX1,
    innerX2,
    levelY,
    progressWidth,
    progressX,
    width: taskWidth,
    x1: taskX1,
    x2: taskX2,
    y,
  };
};

/**
 * @param tasks List of tasks
 */
export const getMapTaskToCoordinates = (
  tasks: readonly TaskOrEmpty[],
  visibleTasksMirror: Readonly<Record<string, true>>,
  taskToRowIndexMap: TaskToRowIndexMap,
  axis: TimelineAxis,
  rtl: boolean,
  fullRowHeight: number,
  taskHeight: number,
  taskYOffset: number,
  distances: Distances,
  svgWidth: number
): MapTaskToCoordinates => {
  const res = new Map<number, Map<string, TaskCoordinates>>();

  tasks.forEach(task => {
    if (task.type === "empty") {
      return;
    }

    const { id, comparisonLevel = 1 } = task;

    if (!visibleTasksMirror[id]) {
      return;
    }

    const taskCoordinates = countTaskCoordinates(
      task,
      taskToRowIndexMap,
      axis,
      rtl,
      fullRowHeight,
      taskHeight,
      taskYOffset,
      distances,
      svgWidth
    );

    const resByLevel =
      res.get(comparisonLevel) || new Map<string, TaskCoordinates>();
    resByLevel.set(id, taskCoordinates);
    res.set(comparisonLevel, resByLevel);
  });

  return res;
};
