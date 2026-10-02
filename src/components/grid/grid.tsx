import React, { useMemo } from "react";
import { DateExtremity, DateSetup, ViewMode } from "../../types/public-types";
import { TimelineAxis, dateToX } from "../../helpers/timeline-axis";
import { getCalendarCells } from "../../helpers/calendar-cells";

export type GridProps = {
  axis: TimelineAxis;
  columnWidth: number;
  ganttFullHeight: number;
  dateSetup: DateSetup;
  isUnknownDates: boolean;
  todayColor: string;
  holidayBackgroundColor: string;
  checkIsHoliday: (date: Date, dateExtremity: DateExtremity) => boolean;
};

export const Grid: React.FC<GridProps> = ({ axis, columnWidth, ganttFullHeight, dateSetup, isUnknownDates, todayColor, holidayBackgroundColor, checkIsHoliday }) => {
  const { cells, viewMode } = useMemo(() => getCalendarCells(axis, dateSetup.viewMode, columnWidth), [axis, dateSetup.viewMode, columnWidth]);
  const todayX = dateToX(axis, new Date());
  const holidayModes = new Set([ViewMode.Day, ViewMode.HalfDay, ViewMode.QuarterDay, ViewMode.Hour]);
  return <g className="grid">
    {holidayModes.has(viewMode) && !isUnknownDates && cells.filter(cell => checkIsHoliday(cell.start, "startOfTask")).map(cell => <rect key={`holiday-${cell.start.getTime()}`} x={cell.x} y={0} width={cell.width} height="100%" fill={holidayBackgroundColor} />)}
    {cells.map(cell => <line key={`grid-${cell.start.getTime()}`} x1={cell.x} x2={cell.x} y1={0} y2={ganttFullHeight} stroke="#ebeff2" />)}
    {!isUnknownDates && todayX >= 0 && todayX <= axis.width && <rect x={todayX} y={0} width={1} height={ganttFullHeight} fill={todayColor} />}
  </g>;
};
