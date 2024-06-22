
import { EGraph } from '../graph/graph';
import { Coordinates, generate_uuid_v4 } from '../graph/helpers';
import { Flow } from '../graph/flow';
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
        // .AddComp(generate_uuid_v4(), {name: "HeavyInfected", population: 1, x: 200, y: 200})
        .AddComp(generate_uuid_v4(), {name: "LightInfected", population: 1, x: 300, y: 300})
        .AddComp(generate_uuid_v4(), {name: "Rejected", population: 0, x: 400, y: 400})
        // .AddComp(generate_uuid_v4(), {name: "Dead", population: 0, x: 500, y: 600})

    g.setStartCompartment("Suspectable");

    // g.AddFlow(generate_uuid_v4(), {from: "Suspectable", to: [
        // {name: "HeavyInfected", coef: 0.8}, {name:"LightInfected",coef: 0.2}
    // ], coef: 0.6, x: 150, y:150});
    // g.AddFlow(generate_uuid_v4(), {from: "HeavyInfected", to: [{name: "Dead", coef: 0.4}, {name: "Rejected",coef: 0.6}], coef: 0.5, x: 350, y:150});
    // g.AddFlow(generate_uuid_v4(), {from: "LightInfected", to: [{name: "Rejected",coef: 1}], coef: 0.3, x: 550, y:150});

    g.AddFlow(generate_uuid_v4(), {from: "Suspectable", to: [{name: "LightInfected", coef: 1}] , coef: 0.06, x: 150, y:150});
    g.AddFlow(generate_uuid_v4(), {from: "LightInfected", to: [{name: "Rejected", coef: 1}], coef: 0.05, x: 350, y:150});
    // g.AddFlow(generate_uuid_v4(), {from: null, to: [], coef: 0.3, x: 550, y:150});


    // var gd = g.getDagreGraph({label_w: 100, node_w: 50, node_h: 50});
    var gd;

    return [g, gd];
}

export const ConstructHandleId = (id, handle_type, node_type, node_name) => {
    return "handle_" + node_type + "_" +  handle_type + "_" + generate_id_v1() + "_" + node_name;
  }

export const ConstructEdgeId = (handles, ids) => {
    return "reactflow__edge-" + ids[0] + handles[0] + "-" + ids[1] + handles[1];
}

export const ParseConstructHandleId = (handle_id) => {
    return handle_id.split("_")
}

/**
 * Временная генерация исходных узлов
 * @param {EGraph} e_graph - граф эпидемиологической модели.
 */
export function getInitialNodes(e_graph) {

    function GenerateHandlesIds(handle_type, node_type, node_name){
        return Array.from({length: 1}, (_, index) => {
            return ConstructHandleId(index, handle_type, node_type, node_name);
        })
    }

    var initial_nodes = [];
    var initial_edges = [];
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
                    outs: GenerateHandlesIds("source", "comp", value.id_.slice(0,6))
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
                    outs: GenerateHandlesIds("source", "flow", value.id_.slice(0,6))
                }
            }
        )
    })

    const constructed_edges = [];
    initial_nodes.forEach((node) => {
        
    })
    return initial_nodes;

}
