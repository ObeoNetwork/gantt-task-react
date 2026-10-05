import {
  createTimelineAxis,
  dateToX,
  getTimelineAxisOffset,
} from "../helpers/timeline-axis";
import type { Task } from "../types/public-types";

describe("timeline axis", () => {
  const start = new Date(2024, 0, 1);
  const end = new Date(2024, 0, 11);
  const tasks: Task[] = [
    {
      id: "task",
      name: "Task",
      progress: 0,
      start,
      end,
      type: "task",
    },
  ];

  it("fits all tasks at 100% with 5% left and 15% right margins", () => {
    const axis = createTimelineAxis(tasks, 1000, 100);

    expect(dateToX(axis, start)).toBeCloseTo(50);
    expect(dateToX(axis, end)).toBeCloseTo(850);
  });

  it("removes mouse-anchor offset only at the 100% task-fit zoom", () => {
    expect(getTimelineAxisOffset(1234, 100, 100)).toBe(0);
    expect(getTimelineAxisOffset(1234, 100, 120)).toBe(1234);
    expect(getTimelineAxisOffset(1234, 50, 50)).toBe(1234);
  });
});
