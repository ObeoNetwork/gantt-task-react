import React, { useCallback, useMemo } from "react";

import { ColumnProps, GanttRenderIconsProps } from "../../../types";

import styles from "./title-column.module.css";
import { ExpandMoreIcon } from "../../icons/expand-more-icon";
import { ExpandLessIcon } from "../../icons/expand-less-icon";

const getExpanderSymbol = (
  hasChildren: boolean,
  isClosed: boolean,
  iconWidth: number,
  icons: Partial<GanttRenderIconsProps> | undefined
) => {
  if (!hasChildren) {
    return icons?.renderNoChildrenIcon ? icons.renderNoChildrenIcon() : "";
  }

  if (isClosed) {
    return icons?.renderClosedIcon ? (
      icons.renderClosedIcon()
    ) : (
      <ExpandMoreIcon width={iconWidth} style={{ verticalAlign: "middle" }} />
    );
  }

  return icons?.renderOpenedIcon ? (
    icons.renderOpenedIcon()
  ) : (
    <ExpandLessIcon width={iconWidth} style={{ verticalAlign: "middle" }} />
  );
};

export const TitleColumn: React.FC<ColumnProps> = ({
  data: {
    distances: { expandIconWidth, nestedTaskNameOffset },
    icons,
    isShowTaskNumbers,
    hasChildren,
    isClosed,
    depth,
    indexStr,
    task,
    onExpanderClick,
  },
}) => {
  const { name } = task;

  const isProject = task.type === "project";

  const expanderSymbol = useMemo(
    () => getExpanderSymbol(hasChildren, isClosed, expandIconWidth, icons),
    [hasChildren, isClosed, expandIconWidth, icons]
  );

  const title = isShowTaskNumbers ? `${indexStr} ${name}` : name;

  const onClick = useCallback(() => {
    if (task.type !== "empty") {
      onExpanderClick(task);
    }
  }, [onExpanderClick, task]);

  return (
    <div
      data-testid={`title-table-cell-${name}`}
      className={`${styles.taskListNameWrapper}`}
      style={{
        paddingLeft: depth * nestedTaskNameOffset,
      }}
      title={title}
    >
      <div
        className={`gantt-expander ${styles.taskListExpander} ${
          !hasChildren ? styles.taskListEmptyExpander : ""
        }`}
        style={{
          left: depth * nestedTaskNameOffset,
        }}
        onClick={onClick}
      >
        {expanderSymbol}
      </div>

      <div
        className={styles.taskName}
        style={{ fontWeight: isProject ? "bold" : 'regular' }}
      >
        {isShowTaskNumbers && <b>{indexStr} </b>}

        {name}
      </div>
    </div>
  );
};
