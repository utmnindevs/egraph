import logo from './logo.svg';


import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';

import 'reactflow/dist/style.css';

import CompartmentNode from "./nodes/compartment_node"

import { Graph } from './graph/graph';
import { Coordinates } from './graph/helpers';
import { Flow } from './graph/flow';
import { Compartment } from './graph/compartment';
import { generate_uuid_v4 } from './graph/helpers';

import './App.css';

var g = new Graph();

const s = new Compartment("Suspectable", generate_uuid_v4(), 100);
const i1 = new Compartment("I1nfected2", generate_uuid_v4(), 1);
const i2 = new Compartment("I2nfected1", generate_uuid_v4(), 1);
const r = new Compartment("Rejected", generate_uuid_v4(), 0);

g.AddCompartment(s).AddCompartment(i1).AddCompartment(i2).AddCompartment(r);
g.start_compartment_ = s;

var g = new Graph(s);
g.AddComp(s).AddComp(i1).AddComp(i2).AddComp(r);

const comps = g.GetComps();
const si_flow = new Flow(generate_uuid_v4(), 0.6, 3, 4);
const ir_flow = new Flow(generate_uuid_v4(), 0.3, 4, 4);
const ir2_flow = new Flow(generate_uuid_v4(), 0.5, 4, 4);
si_flow.SetFromCompartment(s);
si_flow.SetToCompartment(i1, 0.2);
si_flow.SetToCompartment(i2, 0.8);
ir_flow.SetFromCompartment(i1);
ir2_flow.SetFromCompartment(i2);
ir_flow.SetToCompartment(r, 1);
ir2_flow.SetToCompartment(r, 1);
g.AddFlow(si_flow).AddFlow(ir_flow).AddFlow(ir2_flow);
console.log(g.GetFlows().has(si_flow.GetId()));
console.log(g.GetFlows().has(ir_flow.GetId()));

const initialNodes = [
  {
    id: s.GetId(), type: 'compartmentNode',
    position: { x: 100, y: 100 },
    data: {
      population: s.GetPopulation(),
      name: s.GetName(),
      obj: s
    }
  },
  {
    id: i1.GetId(), type: 'compartmentNode',
    position: { x: 200, y: 200 },
    data: {
      population: i1.GetPopulation(),
      name: i1.GetName(),
      obj: i1
    }
  },
  {
    id: i2.GetId(), type: 'compartmentNode',
    position: { x: 300, y: 300 },
    data: {
      population: i2.GetPopulation(),
      name: i2.GetName(),
      obj: i2
    }
  },
  {
    id: r.GetId(), type: 'compartmentNode',
    position: { x: 400, y: 400 },
    data: {
      population: r.GetPopulation(),
      name: r.GetName(),
      obj: r
    }
  },
];

const nodeTypes = { compartmentNode: CompartmentNode };

function App() {

  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState(initialNodes);

  const [compartmentsObjects, setGraphCompartments, onGraphCompartmentChange] = useState(initialNodes);
  const [compartmentsUpdate, setCompartmentsUpdate] = useState([]);


  const updateObject = (objectId, newValues) => {
    setGraphCompartments(graphObjects => {
      return graphObjects.map(obj => {
        if (obj.id === objectId) {
          obj.data = { ...obj.data, population: newValues }
        }
        return obj;
      });
    }, []);
  };

  const updateNodesByObjects = (compartments) => {
    console.log(compartments);
    compartments.forEach(obj => {
      updateObject(obj.GetId(), obj.GetPopulation());
    });
  };

  useEffect(() => {
    console.log(compartmentsUpdate);
    compartmentsUpdate.forEach(obj => {
      updateObject(obj.GetId(), obj.GetPopulation());
    });
  }, [compartmentsUpdate]);

  return (
    <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ height: '500px', width: '1000px' }}>
      <ReactFlow
        nodeTypes={nodeTypes}

        nodes={compartmentsObjects}
        onNodesChange={onGraphCompartmentChange}
      >


        <Background color="#aaa" gap={16} />
        <Controls />
      </ReactFlow>
      <button style={{ height: '40px', width: '50px' }} onClick={async () => {
        for (let i = 0; i < 12; i++) {
          await delay(500);
          g.onCompute(g.GetStarted());
          updateNodesByObjects(g.GetCompartments());
        }
        console.log('Done');

      }} />
    </div>
  );
}


export default App;
