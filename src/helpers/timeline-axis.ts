import { TaskOrEmpty } from "../types/public-types";

const DAY = 24 * 60 * 60 * 1000;

export type TimelineAxis = {
  startDate: Date;
  endDate: Date;
  width: number;
  pixelsPerMillisecond: number;
};

/** A continuous date axis used by bars, dragging and the calendar. */
export const createTimelineAxis = (
  tasks: readonly TaskOrEmpty[],
  width: number,
  zoomLevel: number
): TimelineAxis => {
  const dated = tasks.filter((task): task is Exclude<TaskOrEmpty, { type: "empty" }> => task.type !== "empty");
  const now = Date.now();
  const min = dated.length ? Math.min(...dated.map(task => task.start.getTime())) : now;
  const max = dated.length ? Math.max(...dated.map(task => task.end.getTime())) : now + DAY;
  const taskSpan = Math.max(DAY, max - min);
  const requestedZoom = Number.isFinite(zoomLevel) ? zoomLevel : 100;
  const zoom = Math.min(100, Math.max(1, requestedZoom));
  const fittedSpan = taskSpan / 0.8;
  const extra = fittedSpan * (100 / zoom - 1);
  const start = min - taskSpan * 0.0625 - extra / 2;
  const end = max + taskSpan * 0.1875 + extra / 2;
  const safeWidth = Math.max(1, width);

  return {
    startDate: new Date(start),
    endDate: new Date(end),
    width: safeWidth,
    pixelsPerMillisecond: safeWidth / (end - start),
  };
};

export const dateToX = (axis: TimelineAxis, date: Date) =>
  (date.getTime() - axis.startDate.getTime()) * axis.pixelsPerMillisecond;

export const xToDate = (axis: TimelineAxis, x: number) =>
  new Date(axis.startDate.getTime() + x / axis.pixelsPerMillisecond);

/** The 100% task-fit axis must retain its exact 5%/15% margins. */
export const getTimelineAxisOffset = (
  axisOffsetMs: number,
  requestedZoomLevel: number,
  effectiveZoomLevel: number
) =>
  requestedZoomLevel === 100 && effectiveZoomLevel === 100
    ? 0
    : axisOffsetMs;
