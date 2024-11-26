import React, { useRef, useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
} from '@xyflow/react';
import useColorMode from '@/hooks/useColorMode';

import '@xyflow/react/dist/style.css'
import '@/assets/css/editor.css';

import EditorSidebar from '@/components/Sidebar/EditorSidebar';
import { DnDProvider, useDnD } from '@/hooks/DnDContext';
import { StartNode } from './nodes/startNode';
import { TimeNode } from './nodes/timeNode';
import { DateNode } from './nodes/dateNode';
import { DateTimeNode } from './nodes/datetimeNode';
import { NumberNode } from './nodes/numberNode';
import { DrowDownNode } from './nodes/dropDownNode';
import { AddressNode } from './nodes/addressNode';

const initialNodes = [
];

const nodeTypes = {
  start: StartNode,
  dropDown: DrowDownNode,
  date: DateNode,
  time: TimeNode,
  dateTime: DateTimeNode,
  address: AddressNode,
  number: NumberNode,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const [colorMode, setColorMode] = useColorMode();
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      // check if the dropped element is valid
      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: {
          label: `${type} node`
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type],
  );

  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          nodeTypes={nodeTypes}
          colorMode={colorMode}
        >
          <Controls showFitView={true} showInteractive={true} />
          <Background />
        </ReactFlow>
      </div>
      <EditorSidebar />
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <DnDProvider>
      <DnDFlow />
    </DnDProvider>
  </ReactFlowProvider>
);
