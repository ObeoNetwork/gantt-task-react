import React, { useCallback, useState } from "react";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  Column,
  ColumnProps,
  DateEndColumn,
  DateStartColumn,
  Gantt,
  GanttProps,
  OnChangeTasks,
  Task,
  TaskContextualPaletteProps,
  TaskOrEmpty,
  TitleColumn,
  ViewMode,
} from "../src";

import { initTasks, onAddTask, onEditTask } from "./helper";

import "../dist/style.css";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import styles from "./CustomPalette.module.css";

type AppProps = {
  ganttHeight?: number;
};

export const CustomPalette: React.FC<AppProps> = props => {
  const [tasks, setTasks] = useState<readonly TaskOrEmpty[]>(initTasks());
  const [viewMode, setView] = React.useState<ViewMode>(ViewMode.Day);

  const onChangeTasks = useCallback<OnChangeTasks>(
    (newTaskOrEmptys, action) => {
      const newTasks: Task[] = newTaskOrEmptys.map(task => task as Task);
      switch (action.type) {
        case "delete_relation":
          if (
            window.confirm(
              `Do yo want to remove relation between ${action.payload.taskFrom.name} and ${action.payload.taskTo.name}?`
            )
          ) {
            setTasks(newTasks);
          }
          break;

        case "delete_task":
          if (window.confirm("Are you sure?")) {
            setTasks(newTasks);
          }
          break;

        default:
          const taskWithChildrenIds = newTasks.map((task: Task) => task.parent);
          newTasks.map((task: Task) => {
            if (taskWithChildrenIds.includes(task.id)) {
              task.type = "project";
            } else if (task.start && task.start === task.end) {
              task.type = "milestone";
            } else {
              task.type = "task";
            }
          });
          setTasks(newTasks);
          break;
      }
    },
    []
  );

  const handleDblClick = useCallback((task: Task) => {
    alert("On Double Click event Id:" + task.id);
  }, []);

  const handleClick = useCallback((task: Task) => {
    console.log("On Click event Id:" + task.id);
  }, []);

  const ProgressColumn: React.FC<ColumnProps> = ({ data: { task } }) => {
    if (task.type === "project" || task.type === "task") {
      return <>{task.progress}%</>;
    }

    return null;
  };

  const columns: readonly Column[] = [
    {
      component: TitleColumn,
      width: 210,
      title: "Name",
    },
    {
      component: DateStartColumn,
      width: 150,
      title: "Date of start",
    },
    {
      component: DateEndColumn,
      width: 150,
      title: "Date of end",
    },
    {
      component: ProgressColumn,
      width: 40,
      title: "Progress",
    },
  ];

  const handleTaskDelete = (task: Task) => {
    const conf = window.confirm("Are you sure about " + task.name + " ?");
    if (conf) {
      setTasks(tasks.filter(t => t.id !== task.id));
    }
    return conf;
  };

  const handleWheel = (wheelEvent: WheelEvent) => {
    const deltaY = wheelEvent.deltaY;

    if (deltaY < 0 && viewMode !== ViewMode.Hour) {
      const currentIndex = Object.values(ViewMode).indexOf(viewMode);
      const newZoomLevel = Object.values(ViewMode)[currentIndex - 1];
      if (newZoomLevel) {
        setView(newZoomLevel);
      }
    } else if (deltaY > 0 && viewMode !== ViewMode.Month) {
      const currentIndex = Object.values(ViewMode).indexOf(viewMode);
      const newZoomLevel = Object.values(ViewMode)[currentIndex + 1];
      if (newZoomLevel) {
        setView(newZoomLevel);
      }
    }
  };

  const ContextualPalette: React.FC<TaskContextualPaletteProps> = ({
    selectedTask,
    onClose,
  }) => {
    return (
      <div className={styles.buttonEntries}>
        <IconButton
          size="small"
          aria-label="Delete task"
          title="Delete task"
          onClick={() => handleTaskDelete(selectedTask)}
          data-testid="delete-task"
        >
          <DeleteForeverIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          aria-label="Close toolbar"
          title="Close toolbar"
          onClick={onClose}
          data-testid="close-toolbar"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    );
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <Gantt
        {...props}
        columns={columns}
        onAddTask={onAddTask}
        onChangeTasks={onChangeTasks}
        onDoubleClick={handleDblClick}
        onEditTask={onEditTask}
        onClick={handleClick}
        tasks={tasks}
        viewMode={viewMode}
        roundEndDate={(date: Date) => date}
        roundStartDate={(date: Date) => date}
        ContextualPalette={ContextualPalette}
        onWheel={handleWheel}
      />
    </DndProvider>
  );
};
