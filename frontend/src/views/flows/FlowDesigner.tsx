import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  Node,
  Connection,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Save, Play, Plus } from "lucide-react";

const TriggerNode = ({ data }: { data: any }) => {
  return (
    <Card className="min-w-[200px]">
      <CardHeader className="bg-blue-500 text-white p-2">
        <CardTitle className="text-sm">Trigger: {data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="text-xs">{data.description}</div>
      </CardContent>
    </Card>
  );
};

const ConditionNode = ({ data }: { data: any }) => {
  return (
    <Card className="min-w-[200px]">
      <CardHeader className="bg-amber-500 text-white p-2">
        <CardTitle className="text-sm">Condition: {data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="text-xs">{data.description}</div>
      </CardContent>
    </Card>
  );
};

const ActionNode = ({ data }: { data: any }) => {
  return (
    <Card className="min-w-[200px]">
      <CardHeader className="bg-green-500 text-white p-2">
        <CardTitle className="text-sm">Action: {data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="text-xs">{data.description}</div>
      </CardContent>
    </Card>
  );
};

const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode
};

const FlowDesigner: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [flowName, setFlowName] = useState('New Flow');
  const [flowDescription, setFlowDescription] = useState('');
  
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );
  
  const addTriggerNode = () => {
    const newNode: Node = {
      id: `trigger-${Date.now()}`,
      type: 'trigger',
      position: { x: 100, y: 100 },
      data: { 
        label: 'Keyword Trigger',
        description: 'Triggered when a message contains specific keywords',
        config: {
          type: 'keyword',
          keywords: ['hello', 'hi', 'hey']
        }
      }
    };
    
    setNodes((nds) => nds.concat(newNode));
  };
  
  const addConditionNode = () => {
    const newNode: Node = {
      id: `condition-${Date.now()}`,
      type: 'condition',
      position: { x: 300, y: 200 },
      data: { 
        label: 'Yes/No Condition',
        description: 'Checks if a condition is true or false',
        config: {
          type: 'yes_no',
          field: 'message',
          operator: 'contains',
          value: 'order'
        }
      }
    };
    
    setNodes((nds) => nds.concat(newNode));
  };
  
  const addActionNode = () => {
    const newNode: Node = {
      id: `action-${Date.now()}`,
      type: 'action',
      position: { x: 500, y: 300 },
      data: { 
        label: 'Send Message',
        description: 'Sends a message to the user',
        config: {
          type: 'send_message',
          message: 'Thank you for your message!'
        }
      }
    };
    
    setNodes((nds) => nds.concat(newNode));
  };
  
  const saveFlow = async () => {
    try {
      console.log('Flow data:', {
        name: flowName,
        description: flowDescription,
        nodes,
        edges
      });
      
      
      alert('Flow saved successfully!');
    } catch (error) {
      console.error('Failed to save flow', error);
      alert('Failed to save flow');
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Input 
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              className="text-xl font-bold mb-2"
              placeholder="Flow Name"
            />
            <Input 
              value={flowDescription}
              onChange={(e) => setFlowDescription(e.target.value)}
              placeholder="Flow Description"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={saveFlow}>
              <Save size={20} className="mr-2" />
              Save
            </Button>
            <Button variant="outline">
              <Play size={20} className="mr-2" />
              Test
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={addTriggerNode}>
            <Plus size={16} className="mr-2" />
            Trigger
          </Button>
          <Button variant="outline" onClick={addConditionNode}>
            <Plus size={16} className="mr-2" />
            Condition
          </Button>
          <Button variant="outline" onClick={addActionNode}>
            <Plus size={16} className="mr-2" />
            Action
          </Button>
        </div>
      </div>
      
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowDesigner;
