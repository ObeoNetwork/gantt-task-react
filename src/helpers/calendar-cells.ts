import { getDateByOffset } from "./get-date-by-offset";
import { TimelineAxis, dateToX } from "./timeline-axis";
import { ViewMode } from "../types/public-types";

export type CalendarCell = { start: Date; end: Date; x: number; width: number };

const viewModesByGranularity = [
  ViewMode.Hour,
  ViewMode.QuarterDay,
  ViewMode.HalfDay,
  ViewMode.Day,
  ViewMode.TwoDays,
  ViewMode.Week,
  ViewMode.Month,
  ViewMode.Year,
];

export const getCalendarCellStart = (date: Date, viewMode: ViewMode) => {
  const start = new Date(date);

  switch (viewMode) {
    case ViewMode.Hour:
      start.setMinutes(0, 0, 0);
      break;
    case ViewMode.QuarterDay:
      start.setHours(Math.floor(start.getHours() / 6) * 6, 0, 0, 0);
      break;
    case ViewMode.HalfDay:
      start.setHours(Math.floor(start.getHours() / 12) * 12, 0, 0, 0);
      break;
    case ViewMode.Day:
    case ViewMode.TwoDays:
      start.setHours(0, 0, 0, 0);
      break;
    case ViewMode.Week: {
      const daysSinceMonday = (start.getDay() + 6) % 7;
      start.setDate(start.getDate() - daysSinceMonday);
      start.setHours(0, 0, 0, 0);
      break;
    }
    case ViewMode.Month:
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
    case ViewMode.Year:
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      break;
  }

  return start;
};

const getNextCalendarCellStart = (start: Date, viewMode: ViewMode) => {
  if (
    viewMode === ViewMode.QuarterDay ||
    viewMode === ViewMode.HalfDay
  ) {
    const next = new Date(start);
    const hours = viewMode === ViewMode.QuarterDay ? 6 : 12;
    next.setHours(next.getHours() + hours, 0, 0, 0);
    return next;
  }

  return getDateByOffset(start, 1, viewMode);
};

export const getCalendarCells = (
  axis: TimelineAxis,
  viewMode: ViewMode
): CalendarCell[] => {
  const result: CalendarCell[] = [];
  let index = 0;
  let start = getCalendarCellStart(axis.startDate, viewMode);
  while (start < axis.endDate && index < 10000) {
    const end = getNextCalendarCellStart(start, viewMode);
    const x = Math.max(0, dateToX(axis, start));
    const right = Math.min(axis.width, dateToX(axis, end));
    if (right > x) result.push({ start, end, x, width: right - x });
    start = end;
    index++;
  }
  return result;
};

/** Minimum zoom percentage needed to render the requested mode at minWidth. */
export const getMinimumCalendarZoom = (
  axisAt100Percent: TimelineAxis,
  viewMode: ViewMode,
  minWidth: number
) => {
  const cells = getCalendarCells(axisAt100Percent, viewMode);
  // Cell.width is clipped to the visible axis at both edges. Density must use
  // the complete calendar interval, otherwise a tiny edge fragment can make
  // Week or Month look invalid even though a full column is wide enough.
  const narrowest = Math.min(
    ...cells.map(
      cell =>
        (cell.end.getTime() - cell.start.getTime()) *
        axisAt100Percent.pixelsPerMillisecond
    )
  );

  if (!Number.isFinite(narrowest) || narrowest <= 0) {
    return 1;
  }

  return Math.max(1, (100 * minWidth) / narrowest);
};

/**
 * Returns the requested mode or the first coarser mode whose columns fit at
 * the supplied zoom. Year is the final fallback; its minimum zoom is then
 * enforced by the caller when even year columns are too narrow.
 */
export const getCalendarViewModeForZoom = (
  axisAt100Percent: TimelineAxis,
  requestedViewMode: ViewMode,
  zoomLevel: number,
  minWidth: number
) => {
  const requestedIndex = Math.max(
    0,
    viewModesByGranularity.indexOf(requestedViewMode)
  );

  for (let index = requestedIndex; index < viewModesByGranularity.length; index++) {
    const candidate = viewModesByGranularity[index];
    if (
      candidate === ViewMode.Year ||
      getMinimumCalendarZoom(axisAt100Percent, candidate, minWidth) <=
        zoomLevel
    ) {
      return candidate;
    }
  }

  return ViewMode.Year;
};
