import enUS from "date-fns/locale/en-US";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, it } from "vitest";
import { Calendar } from "../components/calendar/calendar";
import type { TimelineAxis } from "../helpers/timeline-axis";
import { DateSetup, Distances, ViewMode } from "../types/public-types";

describe("Calendar", () => {
  it("clips a two-day bottom label to its column", () => {
    const startDate = new Date(2024, 8, 15);
    const endDate = new Date(2024, 8, 17);
    const axis: TimelineAxis = {
      startDate,
      endDate,
      width: 80,
      pixelsPerMillisecond: 80 / (endDate.getTime() - startDate.getTime()),
    };
    const dateSetup: DateSetup = {
      dateFormats: {
        dateColumnFormat: "E, d MMMM yyyy",
        dayBottomHeaderFormat: "E, d",
        dayTopHeaderFormat: "E, d",
        hourBottomHeaderFormat: "HH",
        monthBottomHeaderFormat: "LLL",
        monthTopHeaderFormat: "LLLL",
      },
      dateLocale: enUS,
      isUnknownDates: false,
      preStepsCount: 1,
      viewMode: ViewMode.TwoDays,
    };

    const markup = renderToStaticMarkup(
      <Calendar
        axis={axis}
        dateSetup={dateSetup}
        distances={{ headerHeight: 50 } as Distances}
        fontFamily="Arial"
        fontSize="14px"
        fullSvgWidth={80}
        isUnknownDates={false}
      />
    );

    expect(markup).toContain("<clipPath");
    expect(markup).toContain(
      '<rect x="0" y="25" width="80" height="25"></rect>'
    );
    expect(markup).toMatch(/clip-path="url\(#.+-bottom-0\)"/);
    expect(markup).toContain('x="4" y="45" text-anchor="start"');
  });
});
