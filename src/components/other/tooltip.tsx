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
  TooltipContent: ComponentType<{
    task: Task;
    fontSize: string;
    fontFamily: string;
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
      <TooltipContent task={task} fontSize={fontSize} fontFamily={fontFamily} />
    </div>
  );
};

export const StandardTooltipContent: React.FC<{
  task: Task;
  fontSize: string;
  fontFamily: string;
}> = ({ task, fontSize, fontFamily }) => {
  const style = {
    fontSize,
    fontFamily,
  };

  const duration = (): number => {
            const diff =
              (task.end.getTime() - task.start.getTime()) /
              (1000 * 60 * 60 * 24);

            const floor = Math.floor(diff);
            let remainder = diff % 1;
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

  return (
    <div className={styles.tooltipDefaultContainer} style={style}>
      <b style={{ fontSize: fontSize + 6 }}>{`${
        task.name
      }: ${task.start.getDate()}-${
        task.start.getMonth() + 1
      }-${task.start.getFullYear()} - ${task.end.getDate()}-${
        task.end.getMonth() + 1
      }-${task.end.getFullYear()}`}</b>
      {task.end.getTime() - task.start.getTime() !== 0 && (
        <p className={styles.tooltipDefaultContainerParagraph}>
          <strong>Duration: </strong>
          {`${duration()} day(s)`}
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
