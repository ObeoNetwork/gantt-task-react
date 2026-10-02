import type { ReactNode } from "react";

import type { CalendarCell } from "../../helpers/calendar-cells";
import { ViewMode } from "../../types/public-types";

export type CalendarHeaderGroup = {
  label: ReactNode;
  width: number;
  x: number;
};

const areHeaderLabelsEqual = (left: ReactNode, right: ReactNode) =>
  (typeof left === "string" || typeof left === "number") &&
  (typeof right === "string" || typeof right === "number")
    ? left === right
    : Object.is(left, right);

/** Merge adjacent calendar cells whose top-header labels are identical. */
export const getCalendarHeaderGroups = (
  cells: readonly CalendarCell[],
  labels: readonly ReactNode[]
): CalendarHeaderGroup[] => {
  const groups: CalendarHeaderGroup[] = [];

  cells.forEach((cell, index) => {
    const label = labels[index];
    const previous = groups[groups.length - 1];

    if (previous && areHeaderLabelsEqual(previous.label, label)) {
      previous.width = cell.x + cell.width - previous.x;
      return;
    }

    groups.push({ label, width: cell.width, x: cell.x });
  });

  return groups;
};

/** Position a two-day label from the left edge rather than between both days. */
export const getCalendarBottomLabelX = (
  cell: CalendarCell,
  viewMode: ViewMode
) =>
  cell.x +
  (viewMode === ViewMode.TwoDays ? Math.min(4, cell.width / 2) : cell.width / 2);
