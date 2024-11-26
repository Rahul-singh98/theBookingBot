import React from 'react';
import { useDnD } from '@/hooks/DnDContext';

export default () => {
  const [_, setType] = useDnD();

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode start" onDragStart={(event) => onDragStart(event, 'start')} draggable>
        Start Node
      </div>
      <div className="dndnode dropDown" onDragStart={(event) => onDragStart(event, 'dropDown')} draggable>
        DropDown Node
      </div>
      <div className="dndnode date" onDragStart={(event) => onDragStart(event, 'date')} draggable>
        Date Node
      </div>
      <div className="dndnode time" onDragStart={(event) => onDragStart(event, 'time')} draggable>
        Time Node
      </div>
      <div className="dndnode dateTime" onDragStart={(event) => onDragStart(event, 'dateTime')} draggable>
        DateTime Node
      </div>
      <div className="dndnode address" onDragStart={(event) => onDragStart(event, 'address')} draggable>
        Address Node
      </div>
      <div className="dndnode number" onDragStart={(event) => onDragStart(event, 'number')} draggable>
        Number Node
      </div>
    </aside>
  );
};
