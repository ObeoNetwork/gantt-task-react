import enUS from "date-fns/locale/en-US";

import { describe, expect, test } from "vitest";
import { defaultRenderTopHeader } from "../components/calendar/default-render-top-header";
import { DateSetup, ViewMode } from "../types/public-types";

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
  viewMode: ViewMode.Day,
};

describe("defaultRenderTopHeader", () => {
  test.each([ViewMode.Day, ViewMode.TwoDays])(
    "renders the ISO week and month for %s",
    viewMode => {
      expect(
        defaultRenderTopHeader(new Date(2024, 8, 16), viewMode, dateSetup)
      ).toBe("W38, September");
    }
  );

  test.each([ViewMode.Day, ViewMode.TwoDays])(
    "renders both months as one label when an ISO week crosses a month in %s",
    viewMode => {
      const mondayLabel = defaultRenderTopHeader(
        new Date(2024, 8, 30),
        viewMode,
        dateSetup
      );
      const tuesdayLabel = defaultRenderTopHeader(
        new Date(2024, 9, 1),
        viewMode,
        dateSetup
      );

      expect(mondayLabel).toBe("W40, September, October");
      expect(tuesdayLabel).toBe(mondayLabel);
    }
  );
});
