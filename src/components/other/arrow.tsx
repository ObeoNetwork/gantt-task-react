import React, {
  memo,
  useCallback,
  useMemo,
} from "react";

import cx from 'classnames';

import {
  OnArrowDoubleClick,
  Task,
  TaskCoordinates,
} from "../../types/public-types";
import { RelationMoveTarget } from "../../types/gantt-task-actions";
import { generateTrianglePoints } from "../../helpers/generate-triangle-points";
import { FixDependencyPosition, fixPositionContainerClass } from "./fix-dependency-position";

import styles from "./arrow.module.css";

type ArrowProps = {
  taskFrom: Task;
  targetFrom: RelationMoveTarget;
  taskTo: Task;
  targetTo: RelationMoveTarget;
  /**
   * dependency warnings for task `taskTo`
   */
  warningsByTask?: Map<string, number>;
  mapTaskToCoordinatesByLevel: Map<string, TaskCoordinates>;
  mapTaskRowIndexByLevel: Map<string, number>;
  fullRowHeight: number;
  taskHeight: number;
  arrowColor: string;
  arrowWarningColor: string;
  arrowIndent: number;
  dependencyFixWidth: number;
  dependencyFixHeight: number;
  dependencyFixIndent: number;
  rtl: boolean;
  onArrowDoubleClick?: OnArrowDoubleClick;
  handleFixDependency: (
    task: Task,
    delta: number,
  ) => void;
};

const ArrowInner: React.FC<ArrowProps> = ({
  taskFrom,
  targetFrom,
  taskTo,
  targetTo,
  warningsByTask = undefined,
  mapTaskToCoordinatesByLevel,
  mapTaskRowIndexByLevel,
  fullRowHeight,
  taskHeight,
  arrowColor,
  arrowWarningColor,
  arrowIndent,
  dependencyFixWidth,
  dependencyFixHeight,
  dependencyFixIndent,
  rtl,
  onArrowDoubleClick = undefined,
  handleFixDependency,
}) => {
  const onDoubleClick = useCallback(() => {
    if (onArrowDoubleClick) {
      onArrowDoubleClick(taskFrom, taskTo);
    }
  }, [
    taskFrom,
    taskTo,
    onArrowDoubleClick,
  ]);

  const coordinatesFrom = useMemo(() => {
    const {
      id,
    } = taskFrom;

    const res = mapTaskToCoordinatesByLevel.get(id);

    if (!res) {
      throw new Error(`Coordinates for task ${id} are not found`);
    }

    return res;
  }, [taskFrom, mapTaskToCoordinatesByLevel]);

  const indexFrom = useMemo(() => {
    const {
      id,
    } = taskFrom;

    const res = mapTaskRowIndexByLevel.get(id);

    if (!res) {
      throw new Error(`Row index for task ${id} is not found`);
    }

    return res;
  }, [taskFrom, mapTaskRowIndexByLevel]);

  const coordinatesTo = useMemo(() => {
    const {
      id,
    } = taskTo;

    const res = mapTaskToCoordinatesByLevel.get(id);

    if (!res) {
      throw new Error(`Coordinates for task ${id} are not found`);
    }

    return res;
  }, [taskTo, mapTaskToCoordinatesByLevel]);

  const indexTo = useMemo(() => {
    const {
      id,
    } = taskTo;

    const res = mapTaskRowIndexByLevel.get(id);

    if (!res) {
      throw new Error(`Row index for task ${id} is not found`);
    }

    return res;
  }, [taskTo, mapTaskRowIndexByLevel]);

  const [path, trianglePoints] = useMemo(
    () => drownPathAndTriangle(
      indexFrom,
      coordinatesFrom,
      (targetFrom === 'startOfTask') !== rtl,
      indexTo,
      coordinatesTo,
      (targetTo === 'startOfTask') !== rtl,
      fullRowHeight,
      taskHeight,
      arrowIndent,
    ),
    [
      indexFrom,
      coordinatesFrom,
      targetFrom,
      indexTo,
      coordinatesTo,
      targetTo,
      rtl,
      fullRowHeight,
      taskHeight,
      arrowIndent,
    ],
  );

  const taskFromFixerPosition = useMemo(() => {
    const isLeft = (targetFrom === 'startOfTask') !== rtl;

    if (isLeft) {
      return coordinatesFrom.x1 - dependencyFixIndent;
    }

    return coordinatesFrom.x2 + dependencyFixIndent;
  }, [
    coordinatesFrom,
    targetFrom,
    rtl,
    dependencyFixIndent,
  ]);

  const taskToFixerPosition = useMemo(() => {
    const isLeft = (targetTo === 'startOfTask') !== rtl;

    if (isLeft) {
      return coordinatesTo.x1 - dependencyFixIndent;
    }

    return coordinatesTo.x2 + dependencyFixIndent;
  }, [
    coordinatesTo,
    targetTo,
    rtl,
    dependencyFixIndent,
  ]);

  const warningDelta = useMemo(() => {
    if (!warningsByTask) {
      return undefined;
    }

    return warningsByTask.get(taskFrom.id);
  }, [
    taskFrom,
    warningsByTask,
  ]);

  const fixDependencyTaskFrom = useCallback(() => {
    if (typeof warningDelta !== 'number') {
      return;
    }

    handleFixDependency(taskFrom, -warningDelta);
  }, [taskFrom, handleFixDependency, warningDelta]);

  const fixDependencyTaskTo = useCallback(() => {
    if (typeof warningDelta !== 'number') {
      return;
    }

    handleFixDependency(taskTo, warningDelta);
  }, [taskTo, handleFixDependency, warningDelta]);

  const hasWarning = useMemo(
    () => typeof warningDelta === 'number',
    [warningDelta],
  );

  const color = useMemo(() => {
    if (hasWarning) {
      return arrowWarningColor;
    }

    return arrowColor;
  }, [
    hasWarning,
    arrowColor,
    arrowWarningColor,
  ]);

  return (
    <g
      className={fixPositionContainerClass}
      fill={color}
      stroke={color}
    >
      <g
        className={cx("arrow", {
          [styles.arrow_clickable]: onDoubleClick,
        })}
        onDoubleClick={onDoubleClick}
      >
        {onArrowDoubleClick && (
          <path
            d={path}
            className={styles.clickZone}
          />
        )}

        <path
          className={styles.mainPath}
          d={path}
        />

        <polygon points={trianglePoints} />
      </g>

      {hasWarning && (
        <>
          <FixDependencyPosition
            x={taskToFixerPosition}
            y={coordinatesTo.y}
            dependencyFixIndent={dependencyFixIndent}
            isLeft={rtl}
            color="grey"
            width={dependencyFixWidth}
            height={dependencyFixHeight}
            onMouseDown={fixDependencyTaskTo}
          />

          <FixDependencyPosition
            x={taskFromFixerPosition}
            y={coordinatesFrom.y}
            dependencyFixIndent={dependencyFixIndent}
            isLeft={!rtl}
            color="grey"
            width={dependencyFixWidth}
            height={dependencyFixHeight}
            onMouseDown={fixDependencyTaskFrom}
          />
        </>
      )}
    </g>
  );
};

export const Arrow = memo(ArrowInner);

const drownPathAndTriangle = (
  indexForm: number,
  from: TaskCoordinates,
  isTaskFromLeftSide: boolean,
  indexTo: number,
  to: TaskCoordinates,
  isTaskToLeftSide: boolean,
  fullRowHeight: number,
  taskHeight: number,
  arrowIndent: number
) => {
  const isDownDirected = indexTo > indexForm;
  const horizontalDockingY = isDownDirected
    ? ((indexForm + 1) * fullRowHeight)
    : (indexForm * fullRowHeight);

  const taskFromEndPositionX = isTaskFromLeftSide
    ? from.x1 - arrowIndent
    : from.x2 + arrowIndent;

  const taskToEndPositionX = isTaskToLeftSide
    ? to.x1 - arrowIndent
    : to.x2 + arrowIndent;
  const taskToEndPositionY = to.y + taskHeight / 2;

  const path = `M ${isTaskFromLeftSide ? from.x1 : from.x2} ${from.y + taskHeight / 2}
  H ${taskFromEndPositionX}
  V ${horizontalDockingY}
  H ${taskToEndPositionX}
  V ${taskToEndPositionY}
  H ${isTaskToLeftSide ? to.x1 : to.x2}`;

  const trianglePoints = isTaskToLeftSide
    ? generateTrianglePoints(
      to.x1,
      taskToEndPositionY,
      5,
      false,
    )
    : generateTrianglePoints(
      to.x2,
      taskToEndPositionY,
      5,
      true,
    );

  return [path, trianglePoints];
};
