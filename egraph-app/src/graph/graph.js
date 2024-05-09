
import { Flow } from "./flow";

const compute_event = new Event("compute");

class EGraph {
    constructor(start) {
      this.id_to_flow_ = new Map();
      this.id_to_comp_ = new Map();
      this.start_compartment_ = start;
    }
    AddCompartment(comp){
      const id_comp = comp.GetId();
      if(!this.id_to_comp_.has(id_comp)){
        this.id_to_comp_.set(id_comp, comp);
      }
      return this;
    }

    AddFlow(flow) {
      const id_flow = flow.GetId();
      if (!this.id_to_flow_.has(id_flow)) {
        this.id_to_flow_.set(id_flow, flow);
      }
      return this;
    }
    AddComp(comp){
      const id_comp = comp.GetId();
      if(!this.id_to_comp_.has(id_comp)){
        this.id_to_comp_.set(id_comp, comp);
      }
      return this;
    }
    DeleteFlow(flow) {
      const id_flow = flow.GetId();
      if (this.id_to_flow_.has(id_flow)) {
        this.id_to_flow_.delete(id_flow);
      }
    }
    DeleteComp(comp) {
      const id_comp = comp.GetId();
      if (this.id_to_comp_.has(id_comp)) {
        this.id_to_comp_.delete(id_comp);
      }
    }
    FindFlowByFromComp(comp) {
      for (const [name, ptr] of this.id_to_flow_) {
        var comps_by_flow = ptr.GetFromComp();
        if(comps_by_flow == comp){
          return ptr;
        }
      }
      return null;
    }
    FindFlowByToComp(comp) {
      for (const [name, ptr] of this.id_to_flow_) {
        const comps_by_flow = ptr.GetToComps();
        if (comps_by_flow.has(comp)) {
          return ptr;
        }
      }
      return null;
    }
    ComputePopulation(comp) {
      const flow = this.FindFlowByFromComp(comp);
      if (flow) {
        const population_comp = comp.GetPopulation();
        const data_population = flow.GetCoef() * population_comp;
        flow.SetItPopulation(data_population);
        for (const [ptr, coef] of flow.GetToComps()) {
          // ptr.SetPopulation(ptr.GetPopulation() + (population_comp - data_population) * coef);
          this.ComputePopulation(ptr);
        }
      }
    }
    ApplyIterationPopulation(comp){
      const flow = this.FindFlowByFromComp(comp);
      if(flow){
        const it_population = flow.GetItPopulation();
        flow.GetFromComp().SetPopulationFromDiff(-1*it_population);
        for(const [comp, coef] of flow.GetToComps()){
          comp.SetPopulationFromDiff(it_population*coef);
          this.ApplyIterationPopulation(comp);
        }
      }
    }
    onCompute(comp){
      this.ComputePopulation(comp);
      this.ApplyIterationPopulation(comp);
      console.log(this);
    }
    // ApplyIterationPopulation
    GetFlows() {
      return this.id_to_flow_;
    }
    GetComps(){
      return this.id_to_comp_;
    }
    GetStarted() {
      return this.start_compartment_;
    }
    UpdateStartedCompartment(new_start) {
      this.start_compartment_ = new_start;
    }


    // serialization to json format
    toJson(){
      var compartments = [];
      this.id_to_comp_.forEach((id, comp) => {
        compartments.push(id.toString());
      });
      var flows = [];
      this.id_to_flow_.forEach((id, flow) => {
        flows.push(id.toString());
      });
      return JSON.stringify({
        compartments,
        flows,
      });
    }


    // get all flows and comps to graph for layer-drawing
    toNodeEdgeGraph(){
      var compartments = [];
      this.id_to_comp_.forEach((comp, id) => {
        compartments.push({id: comp.GetName().slice(0,2)});
      });

      var flows_sources = [];
      this.id_to_flow_.forEach((flow, id) => {
        flow.to_coefs_.forEach((id_comp, comp) => {
          flows_sources.push({
            source: flow.from_.GetName().slice(0,2), target: comp.GetName().slice(0,2)
          })
        })
      });

      const graph = {
        nodes: compartments,
        edges: flows_sources
      }
      return graph;
    }


  }

  export {EGraph};