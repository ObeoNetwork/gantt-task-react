import type { ContextMenuOptionType } from "../types/public-types";
import { GanttLocale } from "../types/public-types";

export const createDeleteOption = (locale: GanttLocale): ContextMenuOptionType => ({
  action: ({
    getTasksWithDescendants,
    handleDeleteTasks,
    resetSelectedTasks: resetSelectedTasksAction,
    task,
  }) => {
    const tasksWithDescendants = getTasksWithDescendants();

    handleDeleteTasks(
      tasksWithDescendants.length === 0 ? [task] : tasksWithDescendants
    );

    resetSelectedTasksAction();
  },
  icon: (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 0 24 24"
        width="24"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z" />
      </svg>
    </>
  ),
  label: locale.context.delete,
});