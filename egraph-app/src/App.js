import logo from './logo.svg';


import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background , addEdge, applyEdgeChanges, applyNodeChanges} from 'reactflow';

import 'reactflow/dist/style.css';

import CompartmentNode from "./nodes/compartment_node"

import { Graph } from './graph/graph';
import { Coordinates } from './graph/helpers';
import { Flow } from './graph/flow';
import { Compartment } from './graph/compartment';
import { generate_uuid_v4 } from './graph/helpers';

import './App.css';


const s = new Compartment("Suspectable", generate_uuid_v4(), 100);
const i1 = new Compartment("I1nfected2", generate_uuid_v4(), 1);
const i2 = new Compartment("I2nfected1", generate_uuid_v4(), 1);
const r = new Compartment("Rejected", generate_uuid_v4(), 0);

const comps = [s, i1, i2, r];
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
var g = new Graph(s);
g.AddFlow(si_flow);
g.AddFlow(ir_flow);
g.AddFlow(ir2_flow);
console.log(g.GetFlows().has(si_flow.GetId()));
console.log(g.GetFlows().has(ir_flow.GetId()));

const initialNodes = [
  { id: s.GetId(), type: 'compartmentNode', 
    position: { x: 100, y: 100 }, 
    data: { 
      population: s.GetPopulation(),
      name: s.GetName() } },
  { id: i1.GetId(), type: 'compartmentNode', 
    position: { x: 200, y: 200 }, 
    data: { 
      population: i1.GetPopulation(),
      name: i1.GetName() } },
  { id: i2.GetId(), type: 'compartmentNode', 
    position: { x: 300, y: 300 }, 
    data: { 
      population: i2.GetPopulation(),
      name: i2.GetName() } },
  { id: r.GetId(), type: 'compartmentNode', 
    position: { x: 400, y: 400 }, 
    data: { 
      population: r.GetPopulation(),
      name: r.GetName() } },
];

const nodeTypes = { compartmentNode: CompartmentNode };

function Run(){
  g.onCompute();
  console.log(g);
}


function App() {

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState(initialNodes);

  const [graphObjects, setGraphObjects] = useState(initialNodes);
  const [compartmentsUpdate, setCompartmentsUpdate] = useState([]);


  const updateObject = (objectId, newValues) => {
    setGraphObjects(graphObjects => {
      return graphObjects.map(obj => {
          if (obj.id === objectId) {
              obj.data = { ...obj.data, population: newValues}
          }
          return obj;
      });
  }, []);
};

useEffect(()=>{
  console.log(compartmentsUpdate);
  compartmentsUpdate.forEach(obj => {
    updateObject(obj.GetId(), obj.GetPopulation());
});
  setCompartmentsUpdate([]);
  
}, [compartmentsUpdate, setCompartmentsUpdate]);

  return (
    <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ height: '500px', width: '1000px' }}>
      <ReactFlow 
        nodeTypes={nodeTypes}
        
        nodes={graphObjects}
        > 


        <Background color="#aaa" gap={16} />
        <Controls />
      </ReactFlow>
      <button style={{height: '40px', width: '50px'}} onClick={() => {
        g.onCompute(g.GetStarted());
        setCompartmentsUpdate(comps);
        
        }}/>
    </div>
  );
}


export default App;
