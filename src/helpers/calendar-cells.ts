import { getDateByOffset } from "./get-date-by-offset";
import { TimelineAxis, dateToX } from "./timeline-axis";
import { ViewMode } from "../types/public-types";

export type CalendarCell = { start: Date; end: Date; x: number; width: number };
const modes = [ViewMode.Hour, ViewMode.QuarterDay, ViewMode.HalfDay, ViewMode.Day, ViewMode.TwoDays, ViewMode.Week, ViewMode.Month, ViewMode.Year];

const cellsFor = (axis: TimelineAxis, viewMode: ViewMode): CalendarCell[] => {
  const result: CalendarCell[] = [];
  let index = 0;
  let start = axis.startDate;
  while (start < axis.endDate && index < 10000) {
    const end = getDateByOffset(axis.startDate, ++index, viewMode);
    const x = Math.max(0, dateToX(axis, start));
    const right = Math.min(axis.width, dateToX(axis, end));
    if (right > x) result.push({ start, end, x, width: right - x });
    start = end;
  }
  return result;
};

export const getCalendarCells = (axis: TimelineAxis, requested: ViewMode, minWidth: number) => {
  let modeIndex = modes.indexOf(requested);
  if (modeIndex < 0) modeIndex = modes.indexOf(ViewMode.Day);
  for (; modeIndex < modes.length; modeIndex++) {
    const viewMode = modes[modeIndex];
    const cells = cellsFor(axis, viewMode);
    const completeCells = cells.filter(cell => cell.end <= axis.endDate);
    if (!cells.length || completeCells.every(cell => cell.width >= minWidth) || viewMode === ViewMode.Year) return { viewMode, cells };
  }
  return { viewMode: ViewMode.Year, cells: cellsFor(axis, ViewMode.Year) };
};
