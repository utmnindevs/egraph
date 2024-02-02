


class Graph {
    constructor(start) {
      this.id_to_flow_ = new Map();
      this.start_compartment_ = start;
    }
    AddFlow(flow) {
      const id_flow = flow.GetId();
      if (!this.id_to_flow_.has(id_flow)) {
        this.id_to_flow_.set(id_flow, flow);
      }
    }
    DeleteFlow(flow) {
      const id_flow = flow.GetId();
      if (this.id_to_flow_.has(id_flow)) {
        this.id_to_flow_.delete(id_flow);
      }
    }
    FindFlowByFromComp(comp) {
      for (const [name, ptr] of this.id_to_flow_) {
        const comps_by_flow = ptr.GetFromComps();
        if (comps_by_flow.has(comp)) {
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
    Compute(comp) {
      const flow = this.FindFlowByFromComp(comp);
      if (flow) {
        const population_comp = comp.GetPopulation();
        const data_population = population_comp * flow.GetFromComps().get(comp) - flow.GetCoef() * population_comp;
        comp.SetPopulation(data_population);
        console.log(comp.GetName().substr(0, 2) + " from " + comp.GetPopulation());
        for (const [ptr, coef] of flow.GetToComps()) {
          ptr.SetPopulation(ptr.GetPopulation() + (population_comp - data_population) * coef);
          console.log(ptr.GetName().substr(0, 2) + " to " + ptr.GetPopulation());
          this.Compute(ptr);
        }
      }
    }
    GetFlows() {
      return this.id_to_flow_;
    }
    GetStarted() {
      return this.start_compartment_;
    }
    UpdateStartedCompartment(new_start) {
      this.start_compartment_ = new_start;
    }
  }

  export {Graph};