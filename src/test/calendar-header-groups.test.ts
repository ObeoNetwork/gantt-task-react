import { describe, expect, it } from "vitest";
import {
  getCalendarBottomLabelX,
  getCalendarHeaderGroups,
} from "../components/calendar/calendar-header-groups";
import type { CalendarCell } from "../helpers/calendar-cells";
import { ViewMode } from "../types/public-types";

const cells: CalendarCell[] = [
  { start: new Date(2024, 8, 16), end: new Date(2024, 8, 17), x: 0, width: 20 },
  {
    start: new Date(2024, 8, 17),
    end: new Date(2024, 8, 18),
    x: 20,
    width: 20,
  },
  {
    start: new Date(2024, 8, 18),
    end: new Date(2024, 8, 19),
    x: 40,
    width: 20,
  },
  {
    start: new Date(2024, 8, 19),
    end: new Date(2024, 8, 20),
    x: 60,
    width: 20,
  },
];

describe("getCalendarHeaderGroups", () => {
  it("merges consecutive cells with the same label", () => {
    expect(
      getCalendarHeaderGroups(cells, [
        "W38, September",
        "W38, September",
        "W38, September",
        "W39, September",
      ])
    ).toEqual([
      { label: "W38, September", x: 0, width: 60 },
      { label: "W39, September", x: 60, width: 20 },
    ]);
  });

  it("does not merge matching labels separated by another label", () => {
    expect(
      getCalendarHeaderGroups(cells.slice(0, 3), ["A", "B", "A"])
    ).toHaveLength(3);
  });

  it("places a two-day label at the left of the column", () => {
    const twoDayCell = { ...cells[0], width: 80 };

    expect(getCalendarBottomLabelX(twoDayCell, ViewMode.TwoDays)).toBe(4);
    expect(getCalendarBottomLabelX(twoDayCell, ViewMode.Day)).toBe(40);
  });
});
