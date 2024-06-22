
import { Compartment } from "./compartment";
import { Flow } from "./flow";
import { generate_uuid_v4 } from "./helpers";

var dagre = require("@xdashduck/dagre-tlayering");


class EGraph {
  /**
   * 
   * @param {Compartment} start - стартовый компартмент, если есть.
   */
  constructor(start = null, jsonData = undefined) {
    this.id_to_flow_ = new Map();
    this.id_to_comp_ = new Map();
    this.start_compartment_ = start != null ? start : null;
    if(jsonData){
      this.deserializeJSON(jsonData)
    }
    this.result_json = undefined;
    this.default_values = undefined;
  }

  getStartedCompartment(){
    return this.start_compartment_;
  }

  /**
   * Добавляет в граф поток
   * @param {*} id 
   * @param {*} flow_config - {from: string, to: array, coef: number}
   * array - [ [string, number], ... ]
   * @returns {EGraph}
   */
  AddFlow(id, flow_config) {
    let temp_flow = new Flow(id, {
      from: this.getCompartmentByName(flow_config.from),
      to: flow_config.to.map(obj => ([this.getCompartmentByName(obj.name), obj.coef])),
      coef: flow_config.coef,
      x: flow_config.x,
      y: flow_config.y
    })
    if (!this.id_to_flow_.has(id)) {
      this.id_to_flow_.set(id, temp_flow);
    }
    return this;
  }

  /**
   * Добавляет в граф компартмент
   * @param {int} id 
   * @param {} comp_config - {name: , population: }
   * @returns {EGraph}
   */
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
  DeleteComp(comp) { // TODO: переписать удаление компартмента, с учетом что от потоков тоже отсоеденились
    const id_comp = comp.GetId();
    if (this.id_to_comp_.has(id_comp)) {
      this.id_to_comp_.delete(id_comp);
    }
    let flow = this.FindFlowByFromComp(comp);
    if(flow){
      flow.DeleteFromCompartment(comp);
    }
    flow = this.FindFlowByToComp(comp);
    if(flow){
      flow.DeleteToCompartment(comp);
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
  ComputePopulation(comp, day) {
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
  ApplyIterationPopulation(comp, day) {
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
  // нулевой пациент ещё
  ConvertPopulationsToJson(day){
    this.id_to_comp_.forEach((comp, id) => {
      this.result_json.at(day)[comp.GetName()] = comp.GetPopulation();
    })
  }
  SaveDefaultValues(){
    const arr = [];
    this.id_to_comp_.forEach((comp, id) => {const res = {name: comp.name_, pop: comp.population_}; arr.push(res);});
    return arr;
  }
  LoadDefaultValues(default_values){
    this.id_to_comp_.forEach((comp, id) => {
      default_values.forEach((data) => {
        if(data.name === comp.GetName()) { comp.SetPopulation(data.pop); };
      })
    })
  }
  onCompute(comp, days = 1) {
    const defaults = this.SaveDefaultValues();
    this.result_json = [];
    this.result_json.push({label: 0});
    this.ConvertPopulationsToJson(0);
    for(var day = 1; day < days; day++){
      this.result_json.push({label: day});
      this.ComputePopulation(comp, day);
      this.ApplyIterationPopulation(comp, day);
      this.ConvertPopulationsToJson(day);
    }
    this.LoadDefaultValues(defaults);
  }


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
    if(compartment_name){
      let compartment = [...this.id_to_comp_.entries()].filter(([ k, v ]) => v.GetName() === compartment_name)
      .map(([k, v]) => v);
      return compartment[0];
    }
    
  }
  getFlowById(flow_id){
    let flow = [...this.id_to_flow_.entries()].filter(([k, v]) => { return k === flow_id;}).map(([k, v]) => v);
    return flow[0];
  }
  getCompartmentById(compartment_id) {
    let compartment = [...this.id_to_comp_.entries()].filter(([ k, v ]) => k === compartment_id)
      .map(([k, v]) => v);
    return compartment[0];
  }
  setStartCompartment(compartment_name) {
    let comp = this.getCompartmentByName(compartment_name);
    this.start_compartment_ = comp;
    comp.SetIsStarted(true)
  }


  /**
   * Сериализация графа в JSON формат
   * @returns {string}
   */
  toJson() {
    var compartments = [];
    this.id_to_comp_.forEach((value, key) => {
      compartments.push(value.toString());
    });
    var flows = [];
    this.id_to_flow_.forEach((value, key) => {
      flows.push(value.toString());
    });
    return JSON.stringify({
      compartments,
      flows,
    });
  }

  /**
   * Конвертирует текущий эпидемиологический граф во множество содержащее ребра и узлы - {nodes: , edges: }
   * @returns {Map}
   */
  toNodeEdgeGraph() {
    var compartments = [];
    this.id_to_comp_.forEach((comp, id) => {
      compartments.push(comp);
    });

    var flows_sources = [];
    this.id_to_flow_.forEach((flow, id) => {
      if(!flow.to_coefs_.size){
        flows_sources.push({v: flow.from_, w: null})
      }
      else{
        flow.to_coefs_.forEach((id_comp, comp) => {
          flows_sources.push({
            v: flow.from_, w: comp
          })
        })
      }
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
   * @returns {dagre.graphlib.Graph}
   */
  getDagreGraph(dagre_config){
    var dagre_graph = new dagre.graphlib.Graph({ directed: true }).setGraph({ rankdir: "LR", ranksep: 10 }); // мб здесь че нибудь

    dagre_graph.setDefaultEdgeLabel(function () { return { width: dagre_config.label_w }; });
    const node_edge_graph = this.toNodeEdgeGraph();
    node_edge_graph.nodes.forEach((nd) => {
      dagre_graph.setNode(nd.GetId(), {label: nd.GetAttr(), width: dagre_config.node_w, height: dagre_config.node_h });
    })
    node_edge_graph.edges.forEach((e) => {
      dagre_graph.setEdge(e.v?.GetId(), e.w?.GetId());
    })

    dagre.layout(dagre_graph, { minlen: 0, ranker: "longest-path" });

    return dagre_graph;
  }

  deserializeJSON(jsonData){
    const parsedData = JSON.parse(jsonData);
    if(this.jsonIsValid(jsonData)){
      parsedData.compartments.forEach((data) => {
        const position = data.position;
        this.AddComp(data.id, {name: data.name, population: data.population, x: position?.x, y: position?.y})
        if(data.is_started){
          this.setStartCompartment(data.name)
        }
      })
      parsedData.flows.forEach((data) => {
        const position = data.position;
        this.AddFlow(data.id, {from: data.from, to: data.to, coef: data.coef, x: position?.x, y: position?.y})
      })
    }
    return this;
  }

  jsonIsValid(jsonData){
    const parsedData = JSON.parse(jsonData);
    return parsedData.compartments && parsedData.flows;
  }

}

export { EGraph };