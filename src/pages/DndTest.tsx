import React, { FC, useState } from 'react';
import DraggableTabPanel from '@/components/DraggableTabPanel';
import { DraggableItemType } from '@/components/DraggableTabPanel/DraggableTab';

const DndTestPage: FC = () => {
  const [tabs, setTabs] = useState<DraggableItemType[]>(
    [...Array(55)].map((_, index) => ({
      id: `tab${index + 1}`,
      label: `Tab ${index + 1}`,
      value: `${index + 1}`,
      content: `Content ${index + 1}`,
    }))
  );
  console.log(`🚀 ~ file: DndTest.tsx:13 ~ tabs:`, tabs);

  const onDragEnd = (result: any) => {
    const newTabs = Array.from(tabs);
    const draggedTab = newTabs.splice(result.source.index, 1)[0];
    newTabs.splice(result.destination.index, 0, draggedTab);
    setTabs(newTabs);
  };

  return (
    <div className="App">
      haahah
      <DraggableTabPanel
        tabs={tabs}
        onTabsUpdate={(tabs) => {
          setTabs(tabs);
        }}
      />
    </div>
  );
};
export default DndTestPage;
