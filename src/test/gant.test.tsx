import React from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Gantt } from "../index";

const originalCreateSVGPoint = Object.getOwnPropertyDescriptor(
  SVGSVGElement.prototype,
  "createSVGPoint"
);

beforeEach(() => {
  Object.defineProperty(SVGSVGElement.prototype, "createSVGPoint", {
    configurable: true,
    value: () => ({ x: 0, y: 0 }),
  });
});

afterEach(() => {
  if (originalCreateSVGPoint) {
    Object.defineProperty(
      SVGSVGElement.prototype,
      "createSVGPoint",
      originalCreateSVGPoint
    );
  } else {
    Reflect.deleteProperty(SVGSVGElement.prototype, "createSVGPoint");
  }
});

describe("gantt", () => {
  it("renders without crashing", () => {
    const { unmount } = render(
      <Gantt
        tasks={[
          {
            start: new Date(2020, 0, 1),
            end: new Date(2020, 2, 2),
            name: "Redesign website",
            id: "Task 0",
            progress: 45,
            type: "task",
          },
        ]}
      />
    );

    expect(screen.getByTestId("gantt-main")).toBeTruthy();
    unmount();
  });
});
