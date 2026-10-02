import { describe, expect, test } from "vitest";
import {
  getCalendarCells,
  getCalendarCellStart,
  getCalendarTopHeaderCells,
  getCalendarViewModeForZoom,
  getMinimumCalendarZoom,
} from "../helpers/calendar-cells";
import { dateToX, TimelineAxis } from "../helpers/timeline-axis";
import { ViewMode } from "../types/public-types";

const startDate = new Date(2024, 0, 1);
const endDate = new Date(2024, 0, 2);
const axis: TimelineAxis = {
  startDate,
  endDate,
  width: 240,
  pixelsPerMillisecond: 240 / (endDate.getTime() - startDate.getTime()),
};

describe("calendar cells", () => {
  test("renders the requested view mode directly", () => {
    expect(getCalendarCells(axis, ViewMode.Hour)).toHaveLength(24);
    expect(getCalendarCells(axis, ViewMode.Day)).toHaveLength(1);
  });

  test("places a week boundary inside a two-day column", () => {
    const sunday = new Date(2024, 8, 15);
    const tuesday = new Date(2024, 8, 17);
    const twoDayAxis: TimelineAxis = {
      startDate: sunday,
      endDate: tuesday,
      width: 200,
      pixelsPerMillisecond: 200 / (tuesday.getTime() - sunday.getTime()),
    };

    const bottomCells = getCalendarCells(twoDayAxis, ViewMode.TwoDays);
    const topCells = getCalendarTopHeaderCells(twoDayAxis, ViewMode.TwoDays);

    expect(bottomCells).toHaveLength(1);
    expect(topCells).toHaveLength(2);
    expect(topCells[1].start).toEqual(new Date(2024, 8, 16));
    expect(topCells[1].x).toBeCloseTo(bottomCells[0].width / 2);
  });

  test("computes the zoom needed for the minimum column width", () => {
    expect(getMinimumCalendarZoom(axis, ViewMode.Hour, 20)).toBeCloseTo(200);
    expect(getMinimumCalendarZoom(axis, ViewMode.Day, 60)).toBeCloseTo(25);
  });

  test("selects a coarser mode when zooming out", () => {
    expect(getCalendarViewModeForZoom(axis, ViewMode.Hour, 100, 20)).toBe(
      ViewMode.QuarterDay
    );
    expect(getCalendarViewModeForZoom(axis, ViewMode.Hour, 200, 20)).toBe(
      ViewMode.Hour
    );
  });

  test("ignores clipped edge cells when selecting week and month modes", () => {
    const rangeStart = new Date(2024, 0, 31, 23);
    const rangeEnd = new Date(2024, 3, 15, 23);
    const rangeAxis: TimelineAxis = {
      startDate: rangeStart,
      endDate: rangeEnd,
      width: 750,
      pixelsPerMillisecond: 750 / (rangeEnd.getTime() - rangeStart.getTime()),
    };

    expect(
      getCalendarViewModeForZoom(rangeAxis, ViewMode.TwoDays, 100, 60)
    ).toBe(ViewMode.Week);
    expect(
      getCalendarViewModeForZoom(rangeAxis, ViewMode.TwoDays, 50, 60)
    ).toBe(ViewMode.Month);
  });

  test("selects month when the visible range contains only partial months", () => {
    const rangeStart = new Date(2024, 0, 31, 23);
    const rangeEnd = new Date(2024, 1, 10, 23);
    const rangeAxis: TimelineAxis = {
      startDate: rangeStart,
      endDate: rangeEnd,
      width: 1000,
      pixelsPerMillisecond: 1000 / (rangeEnd.getTime() - rangeStart.getTime()),
    };

    expect(getCalendarViewModeForZoom(rangeAxis, ViewMode.Week, 5, 60)).toBe(
      ViewMode.Month
    );
  });

  test("aligns cell starts with calendar boundaries", () => {
    const date = new Date(2024, 4, 15, 14, 37, 42, 123);

    expect(getCalendarCellStart(date, ViewMode.Hour).getMinutes()).toBe(0);
    expect(getCalendarCellStart(date, ViewMode.QuarterDay).getHours()).toBe(12);
    expect(getCalendarCellStart(date, ViewMode.HalfDay).getHours()).toBe(12);
    expect(getCalendarCellStart(date, ViewMode.Day).getHours()).toBe(0);
    expect(getCalendarCellStart(date, ViewMode.TwoDays).getHours()).toBe(0);
    expect(getCalendarCellStart(date, ViewMode.Week)).toEqual(
      new Date(2024, 4, 13)
    );
    expect(getCalendarCellStart(date, ViewMode.Month)).toEqual(
      new Date(2024, 4, 1)
    );
    expect(getCalendarCellStart(date, ViewMode.Year)).toEqual(
      new Date(2024, 0, 1)
    );
  });

  test("clips the first cell and aligns midnight with a day boundary", () => {
    const irregularStart = new Date(2024, 0, 1, 3, 30);
    const irregularEnd = new Date(2024, 0, 3, 12);
    const irregularAxis: TimelineAxis = {
      startDate: irregularStart,
      endDate: irregularEnd,
      width: 565,
      pixelsPerMillisecond:
        565 / (irregularEnd.getTime() - irregularStart.getTime()),
    };
    const cells = getCalendarCells(irregularAxis, ViewMode.Day);
    const secondDay = new Date(2024, 0, 2);
    const secondDayCell = cells.find(
      cell => cell.start.getTime() === secondDay.getTime()
    );

    expect(cells[0].start).toEqual(new Date(2024, 0, 1));
    expect(cells[0].x).toBe(0);
    expect(secondDayCell.x).toBeCloseTo(dateToX(irregularAxis, secondDay));
  });

  test("keeps part-of-day cells on local clock boundaries", () => {
    const dstAxis: TimelineAxis = {
      startDate: new Date(2024, 2, 30, 23, 30),
      endDate: new Date(2024, 3, 1, 1),
      width: 500,
      pixelsPerMillisecond:
        500 /
        (new Date(2024, 3, 1, 1).getTime() -
          new Date(2024, 2, 30, 23, 30).getTime()),
    };

    const cells = getCalendarCells(dstAxis, ViewMode.QuarterDay);
    expect(
      cells.every(
        cell => cell.start.getHours() % 6 === 0 && cell.start.getMinutes() === 0
      )
    ).toBe(true);
  });
});
