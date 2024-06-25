
import { EGraph } from '../graph/graph';
import { Coordinates, generate_uuid_v4 } from '../graph/helpers';
import { Flow, Induction } from '../graph/flow';
import { Compartment } from '../graph/compartment';
import { generate_id_v1 } from '../graph/helpers';

var dagre = require("@xdashduck/dagre-tlayering");

/**
 * Генерация тестового графа, представляющий компартментальную модель.
 * @returns {[EGraph, dagre.graphlib.Graph]} 2 графа, представляющие собой 1. EGraph, 2. DagreGraph для отрисовки.
 */
export function generateGraphClass() {

    var g = new EGraph();

    g.AddComp(generate_uuid_v4(), { name: "Suspectable", population: 100, x: 100, y: 100})
        .AddComp(generate_uuid_v4(), {name: "HeavyInfected", population: 1, x: 200, y: 200})
        .AddComp(generate_uuid_v4(), {name: "LightInfected", population: 1, x: 300, y: 300})
        // .AddComp(generate_uuid_v4(), {name: "Rejected", population: 0, x: 400, y: 400})
        // .AddComp(generate_uuid_v4(), {name: "Dead", population: 0, x: 500, y: 600})

    g.setStartCompartment("Suspectable");

    // g.AddFlow(generate_uuid_v4(), {from: "Suspectable", to: [
        // {name: "HeavyInfected", coef: 0.8}, {name:"LightInfected",coef: 0.2}
    // ], coef: 0.6, x: 150, y:150});
    // g.AddFlow(generate_uuid_v4(), {from: "HeavyInfected", to: [{name: "Dead", coef: 0.4}, {name: "Rejected",coef: 0.6}], coef: 0.5, x: 350, y:150});
    // g.AddFlow(generate_uuid_v4(), {from: "LightInfected", to: [{name: "Rejected",coef: 1}], coef: 0.3, x: 550, y:150});

    g.AddFlow(generate_uuid_v4(), {
        from: "Suspectable", 
        to: [{name: "LightInfected", coef: 0.8}, {name: "HeavyInfected", coef: 0.2}] , 
        coef: 0.06, 
        coef_name: "\\beta", 
        induction: [new Induction("LightInfected", 0.4), new Induction("HeavyInfected", 0.25)],
        x: 150, 
        y:150});
    // g.AddFlow(generate_uuid_v4(), {from: "LightInfected", to: [], coef: 0.05, coef_name: "\\mu", x: 350, y:150});
    // g.AddFlow(generate_uuid_v4(), {from: "HeavyInfected", to: [], coef: 0.03, coef_name: "\\omega", x: 550, y:150});


    // var gd = g.getDagreGraph({label_w: 100, node_w: 50, node_h: 50});
    var gd;

    console.log(g)

    return [g, gd];
}

export const ConstructHandleId = (id, handle_type, node_type, node_name) => {
    return "handle_" + node_type + "_" +  handle_type + "_" + generate_id_v1() + "_" + node_name;
  }

export const ConstructEdgeId = (from, to, id_from, id_to) => {
    return "reactflow__edge-" + id_from + from + "-" + id_to + to;
}

export const ParseConstructHandleId = (handle_id) => {
    return handle_id.split("_")
}

export function GenerateHandlesIds(handle_type, node_type, node_name){
    return Array.from({length: 1}, (_, index) => {
        return ConstructHandleId(index, handle_type, node_type, node_name);
    })
}

export function getInitialEdges(e_graph, initial_nodes){
    var initial_edges = [];
    if(!initial_nodes) { return initial_edges; }

    initial_nodes.forEach(node => {
        if(node.type === 'flowNode'){
            const from_comp = node.data.obj.GetFromComp();
            const to_comps = node.data.obj.GetToComps();
            
            if(from_comp){
                const flow_handle_in = node.data.ins.at(-1);
                const comp_node = initial_nodes.find((val) => {return val.data.name === from_comp.GetName();})
                const comp_handle_out = comp_node.data.outs.at(-1);
                initial_edges.push({ 
                    id: ConstructEdgeId(comp_handle_out, flow_handle_in, comp_node.id, node.id), 
                    source: comp_node.id, 
                    target: node.id,
                    sourceHandle: comp_handle_out,
                    targetHandle: flow_handle_in,
                    arrowHeadType: 'arrowclosed',
                });
                comp_node.data.outs.push(ConstructHandleId(0, "source", "comp", comp_node.id.slice(0,6)));
            }
            if(to_comps){
                to_comps.forEach((coef, comp) => {
                    const flow_handle_out = node.data.outs.at(-1);
                    const comp_node = initial_nodes.find((data) => {return data.data.name === comp.GetName();})
                    const comp_handle_in = comp_node.data.ins.at(-1);
                    initial_edges.push({ 
                        id: ConstructEdgeId(flow_handle_out, comp_handle_in, node.id, comp_node.id ),
                        source: node.id,
                        target: comp_node.id,
                        sourceHandle: flow_handle_out,
                        targetHandle: comp_handle_in,
                        arrowHeadType: 'arrowclosed',
                        });
                    node.data.outs.push(ConstructHandleId(0, "source", "flow", node.id.slice(0,6)));
                    comp_node.data.ins.push(ConstructHandleId(0, "target", "comp", comp_node.id.slice(0,6)));
                })
            }
        }
    })

    return initial_edges;
}

/**
 * Временная генерация исходных узлов
 * @param {EGraph} e_graph - граф эпидемиологической модели.
 */
export function getInitialNodes(e_graph) {

    var initial_nodes = [];
    e_graph.GetComps().forEach((value, key) => {
        initial_nodes.push(
            {
                id: key, type: 'compartmentNode',
                position: value.GetPosition(),
                data: {
                    population: value.GetPopulation(),
                    name: value.GetName(),
                    obj: value,
                    ins: GenerateHandlesIds("target", "comp", value.id_.slice(0,6)),
                    outs: GenerateHandlesIds("source", "comp", value.id_.slice(0,6)),
                    corrected: true,
                }
            }
        )
    });
    e_graph.GetFlows().forEach((value, key) => {
        initial_nodes.push(
            {
                id: key, type: 'flowNode',
                position: value.GetPosition(),
                data: {
                    obj: value,
                    ins: GenerateHandlesIds("target", "flow", value.id_.slice(0,6)),
                    outs: GenerateHandlesIds("source", "flow", value.id_.slice(0,6)),
                    corrected: true,
                }
            }
        )
    })
    console.log(e_graph)
    return initial_nodes;

}
