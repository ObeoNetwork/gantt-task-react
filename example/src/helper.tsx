import { Task } from "../../dist/types/public-types";

export function initTasks() {
  const currentDate = new Date();
  const tasks: Task[] = [
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "Some Project",
      id: "ProjectSample",
      progress: 25,
      type: "project",
      hideChildren: false,
      displayOrder: 1,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        2,
        12,
        28
      ),
      name: "Idea",
      id: "Task 0",
      progress: 45,
      type: "task",
      parent: "ProjectSample",
      displayOrder: 2,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      name: "Research",
      id: "Task 1",
      progress: 25,
      dependencies: [
        {
          sourceId: "Task 0",
          sourceTarget: "endOfTask",
          ownTarget: "startOfTask",
        },
      ],
      type: "task",
      parent: "ProjectSample",
      displayOrder: 3,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      name: "Discussion with team",
      id: "Task 2",
      progress: 10,
      dependencies: [
        {
          sourceId: "Task 1",
          sourceTarget: "endOfTask",
          ownTarget: "startOfTask",
        },
      ],
      type: "task",
      parent: "ProjectSample",
      displayOrder: 4,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10, 0, 0),
      name: "Developing",
      id: "developing",
      progress: 50,
      dependencies: [
        {
          sourceId: "Task 2",
          sourceTarget: "endOfTask",
          ownTarget: "startOfTask",
        },
      ],
      type: "task",
      parent: "ProjectSample",
      displayOrder: 5,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9),
      name: "Code",
      id: "code",
      type: "task",
      progress: 40,
      parent: "developing",
      displayOrder: 6,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9),
      name: "Frontend",
      id: "frontend",
      type: "task",
      progress: 40,
      parent: "code",
      displayOrder: 7,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9),
      name: "Backend",
      id: "backend",
      type: "task",
      progress: 40,
      parent: "code",
      displayOrder: 8,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      name: "Review",
      id: "Task 4",
      type: "task",
      progress: 70,
      parent: "developing",
      displayOrder: 9,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "Release",
      id: "Task 6",
      progress: currentDate.getMonth(),
      type: "milestone",
      dependencies: [
        {
          sourceId: "Task 4",
          sourceTarget: "endOfTask",
          ownTarget: "startOfTask",
        },
      ],
      parent: "ProjectSample",
      displayOrder: 10,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
      name: "Party Time",
      id: "Task 9",
      progress: 0,
      isDisabled: true,
      type: "task",
    },
  ];

  const secondLevelTasks = tasks.map<Task>((task) => ({
    ...task,
    comparisonLevel: 2,
  }));

  return [...tasks, ...secondLevelTasks];
}

/**
 * TO DO: optimize
 */
export function getStartEndDateForParent(
  tasks: Task[],
  parentId: string,
  comparisonLevel: number,
) {
  const projectTasks = tasks.filter(({
    parent: otherParentId,
    comparisonLevel: otherComparisonLevel = 1,
  }) => otherParentId === parentId && otherComparisonLevel === comparisonLevel);

  let start = projectTasks[0].start;
  let end = projectTasks[0].end;

  projectTasks.forEach((task) => {
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  });

  return [start, end];
}
