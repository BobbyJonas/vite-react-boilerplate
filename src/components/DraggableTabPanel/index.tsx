import React, { FC, useCallback, useEffect, useState } from 'react';
import cs from 'classnames';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useControllableValue } from 'ahooks';

import DraggableTab, { DraggableItemType } from './DraggableTab';

import './index.less';

export interface IDraggableTabPanel {
  className?: string;
  defaultTabs?: DraggableItemType[];
  tabs?: DraggableItemType[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  onDraggingStatusUpdate?: (value: boolean) => void;
  onTabsUpdate?: (value: DraggableItemType[]) => void;
}

const DraggableTabPanel: FC<Readonly<IDraggableTabPanel>> = (props) => {
  const { className, onDraggingStatusUpdate } = props;

  const [startInitFlag, setStartInitFlag] = useState(false);

  const [tabs, setTabs] = useControllableValue<DraggableItemType[]>(props, {
    defaultValuePropName: 'defaultTabs',
    valuePropName: 'tabs',
    trigger: 'onTabsUpdate',
  });

  const [value, setValue] = useControllableValue<string>(props, {
    defaultValuePropName: 'defaultValue',
    valuePropName: 'value',
    trigger: 'onChange',
  });

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // React 18 下的 rbd 报错修复
    // https://github.com/atlassian/react-beautiful-dnd/issues/2399#issuecomment-1167427762
    const animation = requestAnimationFrame(() => setStartInitFlag(true));

    return () => {
      cancelAnimationFrame(animation);
      setStartInitFlag(false);
    };
  }, []);

  const onCollapseDragStart = useCallback(() => {
    setIsDragging(true);
    onDraggingStatusUpdate?.(true);
  }, [onDraggingStatusUpdate]);

  const onCollapseDragEnd = useCallback(
    (result: any) => {
      const index = result.source?.index ?? -1;
      const resIndex = result.destination?.index ?? -1;
      if (index >= 0 && resIndex >= 0) {
        if (index !== resIndex) {
          const newTabs = [...tabs];
          const navItem = newTabs.splice(index, 1);
          newTabs.splice(resIndex, 0, ...navItem);
          setTabs(newTabs);
        }
      }
      setIsDragging(false);
      onDraggingStatusUpdate?.(false);
    },
    [onDraggingStatusUpdate, setTabs, tabs]
  );

  return (
    <div className={cs('draggable-tab-panel-wrapper', className)}>
      {isDragging && <div className="draggable-tab-panel-placeholder" />}

      <DragDropContext onDragStart={onCollapseDragStart} onDragEnd={onCollapseDragEnd}>
        {startInitFlag && (
          <Droppable direction="horizontal" droppableId="collapse-droppable">
            {(provided, snapshot) => {
              snapshot.isDraggingOver = true;
              return (
                <div
                  className={cs('draggable-tab-panel', 'collapse-droppable')}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {tabs.map((tab, index) => (
                    <DraggableTab
                      className={cs(tab.id === value && 'tab-panel-item--active')}
                      key={tab.id}
                      index={index}
                      value={tab}
                      onMouseDown={() => {
                        setValue(tab.id);
                      }}
                    >
                      {tab.id}
                    </DraggableTab>
                  ))}
                  {provided.placeholder}
                </div>
              );
            }}
          </Droppable>
        )}
      </DragDropContext>
    </div>
  );
};

export default DraggableTabPanel;
