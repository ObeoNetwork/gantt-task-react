# Repository Agent Guide

## Gantt timeline architecture

Treat task geometry, calendar presentation, and zoom as separate concerns.

- `TimelineAxis` is the continuous date-to-pixel scale used by task bars,
  dependencies, dragging, scrolling, Grid, and Calendar. Task coordinates must
  not depend on `ViewMode`.
- `viewMode` is the mode requested by the consumer. The calendar may keep a
  separate effective mode while zooming, but changing `viewMode` explicitly
  must render that exact mode immediately.
- `zoomLevel` is the requested percentage. The effective zoom may be higher to
  keep calendar columns at least `distances.columnWidth` wide.
- Keep the requested values separate from their effective values. Do not write
  an internally selected mode or zoom back into consumer-owned props.

The main implementation is in:

- `src/helpers/timeline-axis.ts`
- `src/helpers/calendar-cells.ts`
- `src/components/gantt/gantt.tsx`

## Required behavior

- At 100% zoom, all visible tasks fit with 5% space before the earliest task
  and 15% after the latest task.
- Below 100%, expand the displayed date range around the fitted task range.
- Above 100%, enlarge the canvas and allow horizontal scrolling.
- During zoom, preserve the date under the mouse pointer. Keep anchor
  correction bounded so it cannot cause a React update loop.
- An explicit `viewMode` change uses that exact mode and raises effective zoom
  when its columns would otherwise be too narrow.
- When the requested zoom changes, the effective calendar mode may coarsen in
  this order: Hour, QuarterDay, HalfDay, Day, TwoDays, Week, Month, Year. When
  zooming back in, return toward the requested mode as soon as it fits.
- Calendar and Grid must use the same generated cells and the same axis.
- Do not round or alter task dates for display. Convert their exact timestamps
  through the shared `dateToX` function. Milestones remain centered on their
  timestamp.

## Calendar cell invariants

- Align cells to real local-calendar boundaries:
  - Hour: start of the hour.
  - QuarterDay: 00:00, 06:00, 12:00, or 18:00.
  - HalfDay: 00:00 or 12:00.
  - Day and TwoDays: 00:00.
  - Week: ISO Monday at 00:00.
  - Month: first day at 00:00.
  - Year: January 1 at 00:00.
- It is valid for the first and last cells to extend beyond the visible axis;
  clip them only for rendering.
- Calculate calendar density from each cell's full theoretical width. Never
  use a clipped edge fragment to choose the effective mode. In particular,
  Week and Month must remain selectable when the visible range contains only
  partial weeks or months.
- Base minimum-zoom and density calculations on the unshifted 100% task-fit
  axis. They must not depend on `axisOffsetMs`, which is only the temporary pan
  offset used for mouse anchoring. Coupling density to this offset can create a
  `Maximum update depth exceeded` loop.
- Preserve local-clock boundaries through daylight-saving transitions,
  especially for QuarterDay and HalfDay.

## Validation

For every timeline, zoom, ViewMode, Calendar, or Grid change:

First determine the current operating system. Use the PowerShell commands on
Windows and the shell commands on Linux. Do not attempt to run both variants.

1. Run the focused calendar tests:

   Windows PowerShell:

   ```powershell
   .\node_modules\.bin\vitest.cmd run src\test\calendar-cells.test.ts --environment node --globals
   ```

   Linux:

   ```bash
   ./node_modules/.bin/vitest run src/test/calendar-cells.test.ts --environment node --globals
   ```

2. Run the TypeScript check:

   Windows PowerShell:

   ```powershell
   .\node_modules\.bin\tsc.cmd --noEmit --emitDeclarationOnly false
   ```

   Linux:

   ```bash
   ./node_modules/.bin/tsc --noEmit --emitDeclarationOnly false
   ```

3. Run the production build:

   Windows PowerShell:

   ```powershell
   .\node_modules\.bin\vite.cmd build
   ```

   Linux:

   ```bash
   ./node_modules/.bin/vite build
   ```

Tests must cover calendar-boundary alignment, clipped edge cells, minimum zoom,
ViewMode progression in both zoom directions, partial Week/Month ranges, and
DST-sensitive subdivisions. Add a focused regression test whenever fixing one
of these behaviors.
