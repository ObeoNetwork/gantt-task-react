import {
  DependencyMap,
  DependencyWarnings,
  ExpandedDependency,
  Task,
  TaskMapByLevel,
} from "../types/public-types";
import { compareDates } from "./compare-dates";

export const getDependencyMapAndWarnings = (
  tasks: Task[],
  tasksMap: TaskMapByLevel,
  isShowDependencyWarnings: boolean,
): [DependencyMap, DependencyWarnings] => {
  const dependencyRes = new Map<number, Map<string, ExpandedDependency[]>>();
  const warningsRes = new Map<number, Map<string, Map<string, number>>>();

  tasks.forEach((task) => {
    const {
      id,
      dependencies,
      comparisonLevel = 1,
    } = task;

    const tasksByLevel = tasksMap.get(comparisonLevel);
    
    if (!dependencies || !tasksByLevel) {
      return;
    }

    const dependenciesByLevel = dependencyRes.get(comparisonLevel)
      || new Map<string, ExpandedDependency[]>();
    const warningsByLevel = warningsRes.get(comparisonLevel)
      || new Map<string, Map<string, number>>();

    let hasWarning = false;

    const dependenciesByTask = dependenciesByLevel.get(id) || [];
    const warningsByTask = warningsByLevel.get(id) || new Map<string, number>();

    dependencies.forEach(({
      sourceId,
      sourceTarget,
      ownTarget,
    }) => {
      const source = tasksByLevel.get(sourceId);

      if (!source) {
        console.error(`Warning: dependency with id "${sourceId}" is not found`);
        return;
      }

      dependenciesByTask.push({
        source,
        sourceTarget,
        ownTarget,
      });

      if (isShowDependencyWarnings) {
        switch (sourceTarget) {
          case "startOfTask":
            switch (ownTarget) {
              case "startOfTask":
              {
                const compareResult = compareDates(source.start, task.start);
                if (compareResult > 0) {
                  hasWarning = true;
                  warningsByTask.set(sourceId, source.start.getTime() - task.start.getTime());
                }
                break;
              }

              case "endOfTask":
                {
                  const compareResult = compareDates(source.start, task.end);
                  if (compareResult > 0) {
                    hasWarning = true;
                    warningsByTask.set(sourceId, source.start.getTime() - task.end.getTime());
                  }
                  break;
                }
  
              default:
                console.error(`Warning: unknown target "${ownTarget}"`);
            }
            break;

          case "endOfTask":
            switch (ownTarget) {
              case "startOfTask":
                {
                  const compareResult = compareDates(source.end, task.start);
                  if (compareResult > 0) {
                    hasWarning = true;
                    warningsByTask.set(sourceId, source.end.getTime() - task.start.getTime());
                  }
                  break;
                }

              case "endOfTask":
                {
                  const compareResult = compareDates(source.end, task.end);
                  if (compareResult > 0) {
                    hasWarning = true;
                    warningsByTask.set(sourceId, source.end.getTime() - task.end.getTime());
                  }
                  break;
                }

              default:
                console.error(`Warning: unknown target "${ownTarget}"`);
            }
            break;
  
          default:
            console.error(`Warning: unknown target "${sourceTarget}"`);
        }
      }
    });

    dependenciesByLevel.set(id, dependenciesByTask);
    dependencyRes.set(comparisonLevel, dependenciesByLevel);

    if (hasWarning) {
      warningsByLevel.set(id, warningsByTask);
      warningsRes.set(comparisonLevel, warningsByLevel);
    }
  });

  return [dependencyRes, warningsRes];
};
