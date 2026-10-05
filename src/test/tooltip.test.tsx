import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, it } from "vitest";

import { StandardTooltipContent } from "../components/other/tooltip";
import type { Task } from "../types/public-types";

const task: Task = {
  id: "task-1",
  type: "task",
  name: "Task",
  start: new Date(2024, 0, 1),
  end: new Date(2024, 0, 2, 12),
  progress: 0,
};

const renderTooltip = (
  currentTask: Task,
  options: {
    isResizing?: boolean;
  } = {}
) =>
  renderToStaticMarkup(
    <StandardTooltipContent
      task={currentTask}
      fontSize="14px"
      fontFamily="Arial"
      {...options}
    />
  );

describe("StandardTooltipContent duration", () => {
  it("uses the computed duration when none is supplied", () => {
    expect(renderTooltip(task)).toContain("1.5 day(s)");
  });

  it("uses the supplied duration instead of the date difference", () => {
    expect(renderTooltip({ ...task, duration: 7 })).toContain("7 day(s)");
  });

  it("keeps the computed duration when a task is moved without resizing", () => {
    const movedTask = {
      ...task,
      start: new Date(2024, 0, 3),
      end: new Date(2024, 0, 4, 12),
    };

    expect(renderTooltip(movedTask)).toContain("1.5 day(s)");
  });

  it("recomputes an omitted duration while resizing", () => {
    const resizedTask = { ...task, end: new Date(2024, 0, 3) };

    expect(renderTooltip(resizedTask, { isResizing: true })).toContain(
      "2 day(s)"
    );
  });

  it("keeps the supplied duration while moving", () => {
    const taskWithDuration = { ...task, duration: 7 };
    const movedTask = {
      ...taskWithDuration,
      start: new Date(2024, 0, 3),
      end: new Date(2024, 0, 5),
    };

    expect(renderTooltip(movedTask)).toContain("7 day(s)");
  });

  it("shows an unknown supplied duration while resizing", () => {
    const markup = renderTooltip(
      { ...task, duration: 7, end: new Date(2024, 0, 3) },
      { isResizing: true }
    );

    expect(markup).toContain("Duration: </strong>?");
    expect(markup).not.toContain("7 day(s)");
  });

  it("shows a supplied zero duration even when the dates are equal", () => {
    expect(renderTooltip({ ...task, end: task.start, duration: 0 })).toContain(
      "0 day(s)"
    );
  });
});
