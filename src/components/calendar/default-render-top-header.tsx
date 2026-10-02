import endOfISOWeek from "date-fns/endOfISOWeek";
import format from "date-fns/format";
import startOfISOWeek from "date-fns/startOfISOWeek";

import { getWeekNumberISO8601 } from "../../helpers/date-helper";
import { DateSetup, ViewMode } from "../../types/public-types";

const getDayText = (date: Date, dateSetup: DateSetup) => {
  try {
    return format(date, dateSetup.dateFormats.dayTopHeaderFormat, {
      locale: dateSetup.dateLocale,
    });
  } catch (e) {
    return String(date.getDate());
  }
};

const getMonthText = (date: Date, dateSetup: DateSetup) => {
  try {
    return format(date, dateSetup.dateFormats.monthTopHeaderFormat, {
      locale: dateSetup.dateLocale,
    });
  } catch (e) {
    return date.toLocaleString("default", { month: "long" });
  }
};

const getWeekText = (date: Date, dateSetup: DateSetup) => {
  const weekStart = startOfISOWeek(date);
  const weekEnd = endOfISOWeek(date);
  const startMonth = getMonthText(weekStart, dateSetup);
  const endMonth = getMonthText(weekEnd, dateSetup);
  const months =
    weekStart.getMonth() === weekEnd.getMonth()
      ? startMonth
      : `${startMonth}, ${endMonth}`;

  return `W${getWeekNumberISO8601(date)}, ${months}`;
};

export const defaultRenderTopHeader = (
  date: Date,
  viewMode: ViewMode,
  dateSetup: DateSetup
): string => {
  switch (viewMode) {
    case ViewMode.Year:
    case ViewMode.Month:
      return date.getFullYear().toString();

    case ViewMode.Week:
      return `${getMonthText(date, dateSetup)}, ${date.getFullYear()}`;

    case ViewMode.Day:
    case ViewMode.TwoDays:
      return getWeekText(date, dateSetup);

    case ViewMode.QuarterDay:
    case ViewMode.HalfDay:
      return `${getDayText(date, dateSetup)} ${getMonthText(date, dateSetup)}`;

    case ViewMode.Hour:
      return `${getDayText(date, dateSetup)} ${getMonthText(date, dateSetup)}`;

    default:
      throw new Error("Unknown viewMode");
  }
};
