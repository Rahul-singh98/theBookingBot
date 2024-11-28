import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useParams } from 'react-router-dom';

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

import { get_questions, create_questions, update_questions } from '@/api/questions';
import { useAuth } from '@/hooks/useAuth';

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
  const { chatbotId } = useParams();
  const { user, afterLogout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await get_questions(chatbotId);
        console.log("Result", result);

        let xAxis = 100;
        const newNodes = [];
        const newEdges = [];

        if (result.items && Array.isArray(result.items)) {
          result.items.forEach((question_response) => {
            const nodeType = question_response.question_type.toLowerCase();
            const initialPosition = { x: xAxis, y: 100 };
            xAxis += 100;

            // Create the node
            const newNode = {
              id: question_response.id,
              type: nodeType,
              position: initialPosition,
              data: {
                label: `${nodeType} node`,
                initial_data: question_response,
                bot_id: question_response.bot_id,
              },
            };

            newNodes.push(newNode);

            // Create an edge if there's a "next_ques"
            if (question_response.next_ques) {
              const edge = {
                id: `edge_${question_response.id}_${question_response.next_ques}`,
                source: question_response.id,
                target: question_response.next_ques,
                animated: false,
                // label: 'next',
              };

              newEdges.push(edge);
            }
          });

          // Update nodes and edges
          setNodes((nds) => nds.concat(newNodes));
          setEdges((eds) => eds.concat(newEdges));
        }
      } catch (err) {
        if (err.message === "Unauthorized") {
          afterLogout();
          navigate(`/login?next=${location.pathname}`);
        } else {
          console.error("Error loading questions:", err);
        }
      }
    };

    loadData();
  }, [chatbotId, navigate, afterLogout]);


  const onChange = useCallback(({ nodes, edges }) => {
    setSelectedNode(nodes.find((node) => node.id));
  }, []);

  useOnSelectionChange({
    onChange,
  });

  const onConnect = useCallback(
    async (params) => {
      setEdges((eds) => addEdge(params, eds));

      // Log the nodes to ensure you're getting the latest state
      console.log('Current nodes:', nodes);

      // Extract source and target node IDs
      const { source, target } = params;

      // Find the source node from the current nodes state
      const sourceNode = nodes.find((node) => node.id === source);

      try {
        await update_questions(
          source,
          sourceNode.data?.initial_data?.bot_id,
          sourceNode.data?.initial_data?.question,
          sourceNode.data?.initial_data?.question_type,
          sourceNode.data?.initial_data?.data,
          sourceNode.data?.initial_data?.variable,
          target);
      } catch (err) {
        console.error("Error updating next_ques:", err);
      }
    },
    [setEdges, chatbotId, nodes] // Make sure to include nodes in the dependency array
  );


  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    async (event) => {
      event.preventDefault();

      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      try {
        let question_type = "";
        switch (type) {
          case "start":
            question_type = "Start";
            break;
          case "end":
            question_type = "End";
            break;
          case "dropDown":
            question_type = "Dropdown";
            break;
          case "date":
            question_type = "Date";
            break;
          case "time":
            question_type = "Time";
            break;
          case "dateTime":
            question_type = "DateTime";
            break;
          case "number":
            question_type = "Number";
            break;
          case "input":
            question_type = "Input";
            break;
          case "number":
            question_type = "Number";
            break;
          case "conditional":
            question_type = "Conditional";
            break;
          case "email":
            question_type = "Email";
            break;
          case "phone":
            question_type = "Phone";
            break;
          case "clickList":
            question_type = "ClickList";
            break;
          case "address":
            question_type = "Address";
            break;
          case "payment":
            question_type = "Payment";
            break;
          default:
            question_type = "default";
        }

        const question_response = await create_questions(chatbotId, "", question_type, {}, "", null);

        const newNode = {
          id: question_response.id,
          type,
          position,
          data: {
            label: `${type} node`,
            bot_id: chatbotId,
          },
        };

        setNodes((nds) => nds.concat(newNode));
      } catch (err) {
        console.error("Error creating question:", err);
        return;
      }
    },
    [screenToFlowPosition, type, chatbotId, setNodes]
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
