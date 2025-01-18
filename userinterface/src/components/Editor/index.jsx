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
import { EmailNode } from './nodes/emailNode';
import { PhoneNode } from './nodes/phoneNode';
import { InputNode } from './nodes/inputNode';
import { ConditionalNode } from './nodes/conditionalNode';
import { ButtonNode } from './nodes/buttonNode'
import { MessageNode } from './nodes/messageNode'
import { RadioNode } from './nodes/radioNode'
import { StripeNode } from './nodes/stripeNode';

import { get_questions, create_questions, update_questions, delete_questions } from '@/api/questions';
import { useAuth } from '@/hooks/useAuth';
import PublishChatbotNode from './panels/PublishChatbotNode';

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
  email: EmailNode,
  phone: PhoneNode,
  input: InputNode,
  conditional: ConditionalNode,
  radio: RadioNode,
  button: ButtonNode,
  message: MessageNode,
  payment: StripeNode,
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
  const [errors, setErrors] = useState("")
  const [type] = useDnD();
  const { chatbotId } = useParams();
  const { user, afterLogout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await get_questions(chatbotId);

        let xAxis = 100;
        const newNodes = [];
        const newEdges = [];

        if (result.items && Array.isArray(result.items)) {
          result.items.forEach((question_response) => {
            const nodeType = question_response.question_type;
            const initialPosition = { x: xAxis, y: 100 };
            xAxis += 100;

            let question_type = "";
            switch (nodeType) {
              case "Start":
                question_type = "start";
                break;
              case "End":
                question_type = "end";
                break;
              case "Dropdown":
                question_type = "dropDown";
                break;
              case "Date":
                question_type = "date";
                break;
              case "Time":
                question_type = "time";
                break;
              case "DateTime":
                question_type = "dateTime";
                break;
              case "Number":
                question_type = "number";
                break;
              case "Input":
                question_type = "input";
                break;
              case "Conditional":
                question_type = "conditional";
                break;
              case "Email":
                question_type = "email";
                break;
              case "Phone":
                question_type = "phone";
                break;
              case "ClickList":
                question_type = "clickList";
                break;
              case "Address":
                question_type = "address";
                break;
              case "Payment":
                question_type = "payment";
                break;
              case "Radio":
                question_type = "radio";
                break;
              case "Button":
                question_type = "button";
                break;
              case "Message":
                question_type = "message";
                break;
              default:
                question_type = "default";
            }

            // Create the node
            const newNode = {
              id: question_response.id,
              type: question_type,
              position: initialPosition,
              data: {
                label: `${question_type} node`,
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

      // Extract source and target node IDs
      const { source, target } = params;
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

  const handleDeleteNode = useCallback(async (nodeId) => {
    try {
      // Delete the target node
      await delete_questions(nodeId);

      // Update nodes and edges in state
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => {
        const filteredEdges = eds.filter((edge) => {
          console.log(edge);
          return edge.source !== nodeId && edge.target !== nodeId;
        });

        // Find edges where target is the nodeId to be deleted
        const targetEdges = eds.filter((edge) => edge.target === nodeId);
        console.log("Target Edge", targetEdges)
        console.log("Nodes", nodes)

        // Update next_ques of source nodes
        targetEdges.forEach(async (edge) => {
          console.log("EachEdge", edge)
          const sourceNode = nodes.find((node) => node.id === edge.source);
          console.log("SourceNode", sourceNode)
          if (sourceNode) {
            try {
              // Call API to update the next_ques of the source node
              await update_questions(sourceNode.id,
                sourceNode.data?.initial_data?.bot_id,
                sourceNode.data?.initial_data?.question,
                sourceNode.data?.initial_data?.question_type,
                sourceNode.data?.initial_data?.data,
                sourceNode.data?.initial_data?.variable,
                null);
            } catch (updateError) {
              console.error(
                `Error updating node ${sourceNode.id} next_ques:`,
                updateError
              );
            }
          }
        });

        return filteredEdges;
      });
    } catch (err) {
      if (err.message === "Unauthorized") {
        afterLogout();
        navigate(`/login?next=${location.pathname}`);
      } else {
        console.error("Error loading questions:", err);
      }
    }
  }, [setNodes, setEdges]);



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
          case "message":
            question_type = "Message";
            break;
          case "radio":
            question_type = "Radio";
            break;
          case "button":
            question_type = "Button";
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
            initial_data: {
              bot_id: chatbotId,
              question_type: question_type
            }
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

  const checkStartAndEndNode = () => {
    setErrors("")

    const startNode = nodes.find((node) => node.type === 'start');
    const endNode = nodes.find((node) => node.type === 'end');
    console.log(startNode, endNode)
    if (startNode === undefined && endNode === undefined) {
      setErrors("Start and End Nodes are required.")
      return false
    } else if (startNode === undefined) {
      setErrors("Start Node is required.")
      return false
    } else if (endNode === undefined) {
      setErrors("End Node is required.")
      return false
    }

    return true
  }

  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        {errors && <p className='text-red-500'>{errors}</p>}
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

          <Panel position='top-center'>
            <PublishChatbotNode chatbotId={chatbotId} readyToPublish={checkStartAndEndNode} />
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
              handleDeleteNode={() => { handleDeleteNode(selectedNode.id) }}
              nodes={nodes}
              setNodes={setNodes}
              setSelectedNode={setSelectedNode}
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
