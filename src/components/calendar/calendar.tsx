import React, { useMemo } from "react";
import { DateSetup, Distances, RenderBottomHeader, RenderTopHeader } from "../../types/public-types";
import { TimelineAxis } from "../../helpers/timeline-axis";
import { getCalendarCells } from "../../helpers/calendar-cells";
import { defaultRenderBottomHeader } from "./default-render-bottom-header";
import { defaultRenderTopHeader } from "./default-render-top-header";
import styles from "./calendar.module.css";

export type CalendarProps = {
  axis: TimelineAxis;
  dateSetup: DateSetup;
  distances: Distances;
  fontFamily: string;
  fontSize: string;
  fullSvgWidth: number;
  isUnknownDates: boolean;
  renderBottomHeader?: RenderBottomHeader;
  renderTopHeader?: RenderTopHeader;
};

export const Calendar: React.FC<CalendarProps> = ({ axis, dateSetup, distances, fontFamily, fontSize, fullSvgWidth, isUnknownDates, renderBottomHeader = defaultRenderBottomHeader, renderTopHeader = defaultRenderTopHeader }) => {
  const { viewMode, cells } = useMemo(() => getCalendarCells(axis, dateSetup.viewMode, distances.columnWidth), [axis, dateSetup.viewMode, distances.columnWidth]);
  const setup = useMemo(() => ({ ...dateSetup, viewMode }), [dateSetup, viewMode]);
  const half = distances.headerHeight * .5;
  return <div className={styles.calendarMain} style={{ width: fullSvgWidth }}>
    <svg xmlns="http://www.w3.org/2000/svg" width={fullSvgWidth} height={distances.headerHeight} fontFamily={fontFamily}>
      <g className="calendar" fontSize={fontSize} fontFamily={fontFamily}>
        {cells.map((cell, index) => <g key={`${cell.start.getTime()}-${index}`}>
          <line x1={cell.x} x2={cell.x} y1={0} y2={distances.headerHeight} stroke="#ebeff2" />
          <text className={styles.calendarTopText} x={cell.x + cell.width / 2} y={half * .8} textAnchor="middle">{renderTopHeader(cell.start, viewMode, setup)}</text>
          <text className={styles.calendarBottomText} x={cell.x + cell.width / 2} y={distances.headerHeight * .9} textAnchor="middle">{renderBottomHeader(cell.start, viewMode, setup, index, isUnknownDates)}</text>
        </g>)}
      </g>
    </svg>
  </div>;
};
