
import { EGraph } from '../graph/graph';
import { Coordinates } from '../graph/helpers';
import { Flow } from '../graph/flow';
import { Compartment } from '../graph/compartment';
import { generate_uuid_v4 } from '../graph/helpers';

var dagre = require("@xdashduck/dagre-tlayering");


export function generateGraphClass() {

    // id тоже мб не нужен, лучше генерировать прямо в графе.
    // TODO: убрать id внутрь генерации узла, чтобы их логика согласовалась внутри узла графа = узел рабочего пространства
    // TODO: потоки изменить до вызова AddFlow(first_name, second_name); с возможным label задающий определенные значения переходов.
    let start_id = generate_uuid_v4();
    var g = new EGraph();
    g.AddComp(start_id, { name: "Suspectable", population: 100 })
        .AddComp(generate_uuid_v4(), {name: "I1nfected2", population: 1})
        .AddComp(generate_uuid_v4(), {name: "I1nfected1", population: 1})
        .AddComp(generate_uuid_v4(), {name: "Rejected", population: 0})
        .AddComp(generate_uuid_v4(), {name: "Dead", population: 0})
    g.setStartCompartment(start_id);

    const comps = g.GetComps();
    const si_flow = new Flow(generate_uuid_v4(), 0.6, 3, 4);
    const ir_flow = new Flow(generate_uuid_v4(), 0.3, 4, 4);
    const ir2_flow = new Flow(generate_uuid_v4(), 0.5, 4, 4);
    const i2d_flow = new Flow(generate_uuid_v4(), 0.5, 4, 4)
    si_flow.SetFromCompartment(s);
    si_flow.SetToCompartment(i1, 0.2);
    si_flow.SetToCompartment(i2, 0.8);
    ir_flow.SetFromCompartment(i1);
    ir2_flow.SetFromCompartment(i2);
    ir_flow.SetToCompartment(r, 1);
    ir2_flow.SetToCompartment(r, 1);
    i2d_flow.SetToCompartment(d, 1);
    i2d_flow.SetFromCompartment(i2, 1);
    g.AddFlow(si_flow).AddFlow(ir_flow).AddFlow(ir2_flow).AddFlow(i2d_flow);

    var gd = new dagre.graphlib.Graph({ directed: true }).setGraph({ rankdir: "LR", ranksep: 10 });

    gd.setDefaultEdgeLabel(function () { return { width: 50 }; });

    gd.setNode(s.GetId(), { label: s.GetAttr(), width: 30, height: 20 });
    gd.setNode(r.GetId(), { label: r.GetAttr(), width: 30, height: 40 });
    gd.setNode(i1.GetId(), { label: i1.GetAttr(), width: 30, height: 20 });
    gd.setNode(i2.GetId(), { label: i2.GetAttr(), width: 30, height: 20 });
    gd.setNode(d.GetId(), { label: d.GetAttr(), width: 30, height: 20 });

    gd.setEdge(s.GetId(), i1.GetId());
    gd.setEdge(s.GetId(), i2.GetId());
    gd.setEdge(i2.GetId(), r.GetId());
    gd.setEdge(i1.GetId(), r.GetId());
    gd.setEdge(i2.GetId(), d.GetId());
    gd.setEdge(s.GetId(), d.GetId());

    dagre.layout(gd, { minlen: 0, ranker: "longest-path" });

    return [g, gd];

}

/**
 * Временная генерация исходных узлов
 * @param {EGraph} e_graph - граф эпидемиологической модели.
 */
export function getInitialNodes(e_graph) {

    var initial_nodes = [];
    let coord_index = 0;
    e_graph.GetComps().forEach((value, key) => {
        coord_index += 100;
        initial_nodes.push(
            {
                id: key, type: 'compartmentNode',
                position: { x: coord_index, y: coord_index },
                data: {
                    population: value.GetPopulation(),
                    name: value.GetName(),
                    obj: value
                }
            }
        )
    });
    return initial_nodes;

}
