import React, { useRef, useCallback, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
  useOnSelectionChange,
  Panel
} from '@xyflow/react';
import useColorMode from '@/hooks/useColorMode';

import '@xyflow/react/dist/style.css'
import '@/assets/css/editor.css';

import NodesPanel from '@/components/Editor/panels/NodesPanel';
import PropertiesPanel from './panels/PropertiesPanel';
import { DnDProvider, useDnD } from '@/hooks/DnDContext';
import { StartNode } from './nodes/startNode';
import { TimeNode } from './nodes/timeNode';
import { DateNode } from './nodes/dateNode';
import { DateTimeNode } from './nodes/datetimeNode';
import { NumberNode } from './nodes/numberNode';
import { DrowDownNode } from './nodes/dropDownNode';
import { AddressNode } from './nodes/addressNode';
import { ClickListNode } from './nodes/clickListNode';
import { EndNode } from './nodes/endNode';

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
  clickList: ClickListNode,
  end: EndNode,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const [colorMode, setColorMode] = useColorMode();
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [selectedNode, setSelectedNode] = useState();
  const [type] = useDnD();

  const onChange = useCallback(({ nodes, edges }) => {
    setSelectedNode(nodes.find((node) => node.id))
  }, []);

  useOnSelectionChange({
    onChange,
  });

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
          <Panel position="top-left">
            <NodesPanel />
          </Panel>

          <Panel position='top-right'>
            <PropertiesPanel
              selectedNode={selectedNode}
              onCollapse={() => {
                setNodes(nodes.map((node) =>
                  node.id === selectedNode.id
                    ? { ...node, selected: false }
                    : node
                ));
                setSelectedNode(null);
              }}
            />
          </Panel>
          <Background />
        </ReactFlow>
      </div>

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
