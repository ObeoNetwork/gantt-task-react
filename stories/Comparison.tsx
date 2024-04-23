import React, { useCallback, useState } from "react";

import { Gantt, OnCommitTasks, Task, RenderTask } from "../src";

import { initTasks, onAddTask, onEditTask } from "./helper";

type AppProps = {
  ganttHeight?: number;
};

export const Comparison: React.FC<AppProps> = props => {
  const [tasks, setTasks] = useState<readonly RenderTask[]>(() => {
    const firstLevelTasks = initTasks();

    const secondLevelTasks = firstLevelTasks.map<Task>(task => ({
      ...task,
      comparisonLevel: 2,
    } as Task));

    return [...firstLevelTasks, ...secondLevelTasks];
  });

  const onChangeTasks = useCallback<OnCommitTasks>((nextTasks, action) => {
    switch (action.type) {
      case "delete_relation":
        if (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          window.confirm(
            `Do yo want to remove relation between ${action.payload.taskFrom.name} and ${action.payload.taskTo.name}?`
          )
        ) {
          setTasks(nextTasks);
        }
        break;

      case "delete_task":
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (window.confirm("Are you sure?")) {
          setTasks(nextTasks);
        }
        break;

      default:
        setTasks(nextTasks);
        break;
    }
  }, []);

  const handleDblClick = useCallback((task: Task) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    alert("On Double Click event Id:" + task.id);
  }, []);

  const handleClick = useCallback((task: RenderTask) => {
    console.log("On Click event Id:" + task.id);
  }, []);

  return (
    <Gantt
      comparisonLevels={2}
      {...props}
      onAddTaskAction={onAddTask}
      onCommitTasks={onChangeTasks}
      onDoubleClick={handleDblClick}
      onEditTaskAction={onEditTask}
      onClick={handleClick}
      isShowTaskNumbers={false}
      tasks={tasks}
      isAdjustToWorkingDates={false}
    />
  );
};
