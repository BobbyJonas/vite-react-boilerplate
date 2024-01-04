/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { MouseEventHandler, CSSProperties, FC, ReactNode, useState } from 'react';
import cs from 'classnames';
import { Draggable } from 'react-beautiful-dnd';

export interface DraggableItemType {
  id: string;
}

export interface IDraggableTabProps {
  className?: string;
  disabled?: boolean;
  index: number;
  children?: ReactNode;
  value: DraggableItemType;
  onMouseDown?: MouseEventHandler<HTMLDivElement>;
}

const DraggableTab: FC<Readonly<IDraggableTabProps>> = (props) => {
  const { className, disabled = false, value, index, children, onMouseDown } = props;

  const [isDragging, setIsDragging] = useState(false);

  return (
    <Draggable
      isDragDisabled={disabled}
      draggableId={`draggable-${value.id}`}
      index={index}
      disableInteractiveElementBlocking
    >
      {(provided, snapshot) => {
        const computedTransformStyle = {
          ...provided.draggableProps.style,
        } as CSSProperties;
        setIsDragging(snapshot.isDragging);
        if (computedTransformStyle.transform) {
          computedTransformStyle.transform = computedTransformStyle.transform.replace(
            /,\s[-+]*\d+px\)/,
            ', 0px)'
          );
        }
        return (
          <div
            aria-label="tab-panel-item"
            ref={provided.innerRef}
            className={cs(
              'tab-panel-item',
              snapshot.isDragging && 'tab-panel-item--dragging',
              className
            )}
            onMouseDown={onMouseDown}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              // 添加样式，只允许在水平方向上拖动
              ...(snapshot.isDragging ? { transform: computedTransformStyle.transform } : {}),
            }}
          >
            {children}
          </div>
        );
      }}
    </Draggable>
  );
};

export default DraggableTab;
