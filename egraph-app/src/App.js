import logo from './logo.svg';


import { Graph } from './graph/graph';
import { Coordinates } from './graph/helpers';
import { Flow } from './graph/flow';
import { Compartment } from './graph/compartment';
import { generate_uuid_v4 } from './graph/helpers';

import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        just testing see console ->
      </header>
    </div>
  );
}

const test = new Coordinates(3, 4);
console.log(test.ComputeDistanceTo(new Coordinates(4, 4)));

const comp = new Compartment("Suspectables", generate_uuid_v4(), 0, new Coordinates(3, 4));
console.log(comp.GetPopulation());

const fw = new Flow(generate_uuid_v4(), 2, new Coordinates(3, 4));
fw.SetFromCompartment(comp);
const gphr = new Graph();
gphr.AddFlow(fw);
console.log(fw === gphr.FindFlowByFromComp(comp));

const s = new Compartment("Suspectable", generate_uuid_v4(), 100);
const i1 = new Compartment("I1nfected2", generate_uuid_v4(), 1);
const i2 = new Compartment("I2nfected1", generate_uuid_v4(), 1);
const r = new Compartment("Rejected", generate_uuid_v4(), 0);
const si_flow = new Flow(generate_uuid_v4(), 0.6, 3, 4);
const ir_flow = new Flow(generate_uuid_v4(), 0.3, 4, 4);
si_flow.SetFromCompartment(s, 1);
si_flow.SetToCompartment(i1, 0.2);
si_flow.SetToCompartment(i2, 0.8);
ir_flow.SetFromCompartment(i1, 1);
ir_flow.SetFromCompartment(i2, 1);
ir_flow.SetToCompartment(r, 1);
const g = new Graph(s);
g.AddFlow(si_flow);
g.AddFlow(ir_flow);
console.log(g.GetFlows().has(si_flow.GetId()));
console.log(g.GetFlows().has(ir_flow.GetId()));
g.Compute(g.GetStarted());
console.log(g);


export default App;
