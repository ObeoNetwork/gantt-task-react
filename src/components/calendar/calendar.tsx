import React, { useId, useMemo } from "react";
import { DateSetup, Distances, RenderBottomHeader, RenderTopHeader, ViewMode } from "../../types/public-types";
import { TimelineAxis } from "../../helpers/timeline-axis";
import {
  getCalendarCells,
  getCalendarTopHeaderCells,
} from "../../helpers/calendar-cells";
import { defaultRenderBottomHeader } from "./default-render-bottom-header";
import { defaultRenderTopHeader } from "./default-render-top-header";
import {
  getCalendarBottomLabelX,
  getCalendarHeaderGroups,
} from "./calendar-header-groups";
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
  const clipPathPrefix = useId().replace(/:/g, "");
  const viewMode = dateSetup.viewMode;
  const cells = useMemo(
    () => getCalendarCells(axis, viewMode),
    [axis, viewMode]
  );
  const topCells = useMemo(
    () => getCalendarTopHeaderCells(axis, viewMode),
    [axis, viewMode]
  );
  const setup = dateSetup;
  const half = distances.headerHeight * .5;
  const topLabels = topCells.map(cell =>
    renderTopHeader(cell.start, viewMode, setup)
  );
  const topGroups = getCalendarHeaderGroups(topCells, topLabels);
  const lastTopGroup = topGroups[topGroups.length - 1];
  const lastCell = cells[cells.length - 1];

  return <div className={styles.calendarMain} style={{ width: fullSvgWidth }}>
    <svg xmlns="http://www.w3.org/2000/svg" width={fullSvgWidth} height={distances.headerHeight} fontFamily={fontFamily}>
      {viewMode === ViewMode.TwoDays && <defs>
        {cells.map((cell, index) => <clipPath id={`${clipPathPrefix}-bottom-${index}`} key={`${cell.start.getTime()}-${index}`}>
          <rect x={cell.x} y={half} width={cell.width} height={half} />
        </clipPath>)}
      </defs>}
      <g className="calendar" fontSize={fontSize} fontFamily={fontFamily}>
        {topGroups.map((group, index) => <g key={`${group.x}-${index}`}>
          <line x1={group.x} x2={group.x} y1={0} y2={half} stroke="#ebeff2" />
          <text className={styles.calendarTopText} x={group.x + group.width / 2} y={half * .8} textAnchor="middle">{group.label}</text>
        </g>)}
        {lastTopGroup && <line x1={lastTopGroup.x + lastTopGroup.width} x2={lastTopGroup.x + lastTopGroup.width} y1={0} y2={half} stroke="#ebeff2" />}
        {cells.map((cell, index) => <g key={`${cell.start.getTime()}-${index}`}>
          <line x1={cell.x} x2={cell.x} y1={half} y2={distances.headerHeight} stroke="#ebeff2" />
          <text className={styles.calendarBottomText} x={getCalendarBottomLabelX(cell, viewMode)} y={distances.headerHeight * .9} textAnchor={viewMode === ViewMode.TwoDays ? "start" : "middle"} clipPath={viewMode === ViewMode.TwoDays ? `url(#${clipPathPrefix}-bottom-${index})` : undefined}>{renderBottomHeader(cell.start, viewMode, setup, index, isUnknownDates)}</text>
        </g>)}
        {lastCell && <line x1={lastCell.x + lastCell.width} x2={lastCell.x + lastCell.width} y1={half} y2={distances.headerHeight} stroke="#ebeff2" />}
      </g>
    </svg>
  </div>;
};
