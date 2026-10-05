import React, { ComponentType } from "react";

import type { Strategy } from "@floating-ui/dom";

import type { Task } from "../../types/public-types";

import styles from "./tooltip.module.css";

export type TooltipProps = {
  tooltipX: number | null;
  tooltipY: number | null;
  tooltipStrategy: Strategy;
  setFloatingRef: (node: HTMLElement | null) => void;
  getFloatingProps: () => Record<string, unknown>;
  task: Task;
  fontSize: string;
  fontFamily: string;
  isResizing: boolean;
  TooltipContent: ComponentType<{
    task: Task;
    fontSize: string;
    fontFamily: string;
    isResizing?: boolean;
  }>;
};

export const Tooltip: React.FC<TooltipProps> = ({
  tooltipX,
  tooltipY,
  tooltipStrategy,
  setFloatingRef,
  getFloatingProps,
  task,
  fontSize,
  fontFamily,
  isResizing,
  TooltipContent,
}) => {
  return (
    <div
      ref={setFloatingRef}
      style={{
        position: tooltipStrategy,
        top: tooltipY ?? 0,
        left: tooltipX ?? 0,
        width: "max-content",
      }}
      {...getFloatingProps()}
    >
      <TooltipContent
        task={task}
        fontSize={fontSize}
        fontFamily={fontFamily}
        isResizing={isResizing}
      />
    </div>
  );
};

export const StandardTooltipContent: React.FC<{
  task: Task;
  fontSize: string;
  fontFamily: string;
  isResizing?: boolean;
}> = ({ task, fontSize, fontFamily, isResizing = false }) => {
  const style = {
    fontSize,
    fontFamily,
  };

  const computedDuration = (): number => {
    const diff =
      (task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24);

    const floor = Math.floor(diff);
    const remainder = diff % 1;
    let roundedRemainder = 0;
    if (remainder < 0.25) {
      roundedRemainder = 0;
    } else if (remainder >= 0.25 && remainder < 0.75) {
      roundedRemainder = 0.5;
    } else if (remainder >= 0.75) {
      roundedRemainder = 1;
    }
    return floor + roundedRemainder;
  };

  const duration = (): string => {
    if (task.duration !== undefined) {
      if (isResizing) {
        return "?";
      } else {
        return `${task.duration} day(s)`;
      }
    } else return `${computedDuration()} day(s)`;
  };

  return (
    <div className={styles.tooltipDefaultContainer} style={style}>
      <b style={{ fontSize: fontSize + 6 }}>{`${
        task.name
      }: ${task.start.getDate()}-${
        task.start.getMonth() + 1
      }-${task.start.getFullYear()} - ${task.end.getDate()}-${
        task.end.getMonth() + 1
      }-${task.end.getFullYear()}`}</b>
      {(task.duration !== undefined ||
        task.end.getTime() - task.start.getTime() !== 0) && (
        <p className={styles.tooltipDefaultContainerParagraph}>
          <strong>Duration: </strong>
          {duration()}
        </p>
      )}

      <p className={styles.tooltipDefaultContainerParagraph}>
        <strong>Progress: </strong>
        {!!task.progress && `${task.progress} %`}
      </p>
      {task.description != undefined ? (
        <p className={styles.tooltipDefaultContainerParagraph}>
          <strong>Description: </strong>
          {task.description}
        </p>
      ) : null}
    </div>
  );
};
