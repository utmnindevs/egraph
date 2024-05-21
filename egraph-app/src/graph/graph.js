
import { Compartment } from "./compartment";
import { Flow } from "./flow";

var dagre = require("@xdashduck/dagre-tlayering");


class EGraph {
  /**
   * 
   * @param {Compartment} start - стартовый компартмент, если есть.
   */
  constructor(start = null) {
    this.id_to_flow_ = new Map();
    this.id_to_comp_ = new Map();
    this.start_compartment_ = start != null ? start : null;
  }

  /**
   * 
   * @param {*} id 
   * @param {*} flow_config - {from: string, to: array, coef: number}
   * array - [ [string, number], ... ]
   * @returns 
   */
  AddFlow(id, flow_config) {
    let temp_flow = new Flow(id, {
      from: this.getCompartmentByName(flow_config.from),
      to: flow_config.to.map(obj => ([this.getCompartmentByName(obj[0]), obj[1]])),
      coef: flow_config.coef
    })
    if (!this.id_to_flow_.has(id)) {
      this.id_to_flow_.set(id, temp_flow);
    }
    return this;
  }

  AddComp(id, comp_config) {
    if (!this.id_to_comp_.has(id)) {
      this.id_to_comp_.set(id, new Compartment(id, comp_config));
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
      if (comps_by_flow == comp) {
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
  ApplyIterationPopulation(comp) {
    const flow = this.FindFlowByFromComp(comp);
    if (flow) {
      const it_population = flow.GetItPopulation();
      flow.GetFromComp().SetPopulationFromDiff(-1 * it_population);
      for (const [comp, coef] of flow.GetToComps()) {
        comp.SetPopulationFromDiff(it_population * coef);
        this.ApplyIterationPopulation(comp);
      }
    }
  }
  onCompute(comp) {
    this.ComputePopulation(comp);
    this.ApplyIterationPopulation(comp);
    console.log(this);
  }
  // ApplyIterationPopulation
  GetFlows() {
    return this.id_to_flow_;
  }
  GetComps() {
    return this.id_to_comp_;
  }
  GetStarted() {
    return this.start_compartment_;
  }

  getCompartmentByName(compartment_name) {
    let compartment = [...this.id_to_comp_.entries()].filter(([ k, v ]) => v.GetName() === compartment_name)
      .map(([k, v]) => v);
    return compartment[0];
  }

  getCompartmentById(compartment_id) {
    let compartment = [...this.id_to_comp_.entries()].filter(({ k, v }) => k === compartment_id)
      .map(([k, v]) => v);
    return compartment[0];
  }
  setStartCompartment(compartment_name) {
    let comp = this.getCompartmentByName(compartment_name);
    this.start_compartment_ = comp;
  }


  // serialization to json format
  toJson() {
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

  toNodeEdgeGraph() {
    var compartments = [];
    this.id_to_comp_.forEach((comp, id) => {
      compartments.push(comp);
    });

    var flows_sources = [];
    this.id_to_flow_.forEach((flow, id) => {
      flow.to_coefs_.forEach((id_comp, comp) => {
        flows_sources.push({
          v: flow.from_, w: comp
        })
      })
    });

    const graph = {
      nodes: compartments,
      edges: flows_sources
    }
    return graph;
  }

  /**
   * Метод конвертации графа в граф для послойного отображения в svg картинке
   * @param {*} dagre_config - Параметры генерации картинки {label_w: , node_w: , node_h} 
   */
  getDagreGraph(dagre_config){
    var dagre_graph = new dagre.graphlib.Graph({ directed: true }).setGraph({ rankdir: "LR", ranksep: 10 }); // мб здесь че нибудь

    dagre_graph.setDefaultEdgeLabel(function () { return { width: dagre_config.label_w }; });
    const node_edge_graph = this.toNodeEdgeGraph();
    node_edge_graph.nodes.forEach((nd) => {
      dagre_graph.setNode(nd.GetId(), {label: nd.GetAttr(), width: dagre_config.node_w, height: dagre_config.node_h });
    })
    node_edge_graph.edges.forEach((e) => {
      dagre_graph.setEdge(e.v.GetId(), e.w.GetId());
    })

    dagre.layout(dagre_graph, { minlen: 0, ranker: "longest-path" });

    return dagre_graph;
  }


}

export { EGraph };