import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, { Controls, Background, ReactFlowProvider, useStore, useReactFlow, useNodes, useViewport, useOnViewportChange } from 'reactflow';
import { getConnectedEdges, applyEdgeChanges, useEdges, addEdge } from 'reactflow';


import SideBarEditable from '../sidebars/editable/SideBarEditable';
import { generate_uuid_v4 } from '../graph/helpers';
import { EGraph } from '../graph/graph';

import { Compartment } from '../graph/compartment';

import { ParseConstructHandleId, ConstructHandleId, GenerateHandlesIds } from './temp';
import { Flow } from '../graph/flow';



/**
 * Генерирует рендер вкладки конструирования модели, содержит методы манипуляции с ними:
 * Создание, редактирование, обновление узлов. 
 * TODO: Изначально генерация класса графа в App.js тут все манипуляции с графом как создание так и редактирование, поэтому
 * нужно перенести сюда все взаимодействия с графом, при этом App.js должен знать о том в каком состоянии граф + если граф меняется в App.js(
 * например загрузка файла, то этот документ должен подгрузить на себя эти изменения.)
 */
function FlowTab({
    e_graph,
    edges,
    nodeTypes,
    nodes,
    onNodesChange,
    setEditableProps,
    setGraphNodes,
    updateNodesByObjects,
    viewportState,
    setViewportState,
    setAddingNode,
    viewportSettings,
    setEdges,
    setViewportSettings,
    setGraphObjects }) {

    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    const edg = useEdges();


    /**
     * Метод удаления ячейки.
     */
    const DeleteHandle = useCallback((node_id, handle_id) => {
        const parsed_handle_id = ParseConstructHandleId(handle_id);
        setGraphObjects(graphObjects => {
            return graphObjects.map(obj => {
                const obj_id = obj?.id;
                if(node_id === obj_id){
                    if (parsed_handle_id[2] === 'source'){
                        var del_index = obj?.data?.outs.indexOf(handle_id);
                        console.log(obj?.data?.outs)
                        obj?.data?.outs.splice(del_index, 1);
                        console.log(obj?.data?.outs)

                    }
                    else if(parsed_handle_id[1] != 'flow'){
                        var del_index = obj?.data?.ins.indexOf(handle_id);
                        obj?.data?.ins.splice(del_index, 1);
                    }
                }
                return obj;
            })
        })
        updateNodesByObjects(e_graph.GetComps());
        updateNodesByObjects(e_graph.GetFlows());
    }, [setGraphObjects, updateNodesByObjects])

    /**
   * Метод добавления новой ячейки.
   */
    const AddNewHandle = useCallback((node_id, handle_id) => {
        const parsed_handle_id = ParseConstructHandleId(handle_id);
        setGraphObjects(graphObjects => {
            return graphObjects.map(obj => {
                const obj_id = obj?.id;
                if (node_id === obj_id) {
                    if (parsed_handle_id[2] === 'source') {
                        const sources_edges = getConnectedEdges([obj], edg).filter(edge => edge.source === obj_id);
                        if (sources_edges.length + 1 === obj?.data?.outs.length) {
                            obj?.data?.outs.push(ConstructHandleId(obj?.data?.outs.length, 'source', obj?.type.slice(0, 4), node_id.slice(0, 6)));
                        }
                    }
                    else if (parsed_handle_id[1] != 'flow') {
                        const targets_edges = getConnectedEdges([obj], edg).filter(edge => edge.target === obj_id);
                        if (targets_edges.length + 1 === obj?.data?.ins.length) {
                            obj?.data?.ins.push(ConstructHandleId(obj?.data?.ins.length, 'target', obj?.type.slice(0, 4), node_id.slice(0, 6)));
                        }
                    }
                }
                return obj;
            })
        })
        updateNodesByObjects(e_graph.GetComps());
        updateNodesByObjects(e_graph.GetFlows());
    }, [setGraphObjects, updateNodesByObjects])

    const GetDiffOfCoefsAndUpdateAll = (flow) => {
        const all_values = [];
        let diff = 0;
        flow.GetToComps().forEach((coef, comp) => {
            diff += coef/2;
            flow.UpdateToComaprtmentCoef(comp, coef/2);
        })
        return diff;
    }

    const ReturnDiffOfCoefs = (flow, deleted_coef) => {
        let size = flow.GetToComps().size;
        flow.GetToComps().forEach((coef, comp) => {
            flow.UpdateToComaprtmentCoef(comp, coef + deleted_coef/size);
        })
    }

    const onConnect = useCallback((params) => {
        AddNewHandle(params?.source, params?.sourceHandle);
        AddNewHandle(params?.target, params?.targetHandle);
        const connected_flow = e_graph.getFlowById(params?.source) || e_graph.getFlowById(params?.target);
        const connected_comp = e_graph.getCompartmentById(params?.source) || e_graph.getCompartmentById(params?.target);
        const is_to_comp = params?.targetHandle.search('flow') === -1;
        if(is_to_comp){
            connected_flow.SetToCompartment(connected_comp, 1 - GetDiffOfCoefsAndUpdateAll(connected_flow));
        }
        else{
            connected_flow.SetFromCompartment(connected_comp);
        }
        setEdges((els) => addEdge({ ...params }, els))
    }, [AddNewHandle]
    );

    



    const ParseChangeId = (change_id) => {
        const result = [];
        const change_id_without_reactflow = change_id.slice(16);
        let first_id = change_id_without_reactflow.slice(0,change_id_without_reactflow.search('handle'));
        let first_handle = change_id_without_reactflow.slice(first_id.length, first_id.length + change_id_without_reactflow.slice(first_id.length).search('-'));
        result.push({id: first_id, handle: first_handle});
        let second_handle = change_id_without_reactflow.slice(change_id_without_reactflow.slice(first_id.length+1).search('handle') + first_id.length+1);
        let second_id = change_id_without_reactflow.slice(first_id.length + first_handle.length + 1, change_id_without_reactflow.length - second_handle.length)
        result.push({id: second_id, handle: second_handle});
        return result;
    }

    const onEdgesChange = useCallback((changes) =>
        setEdges((edg) => {
            if(changes?.at(0)?.type === 'remove'){
                const parsed_data = ParseChangeId(changes?.at(0)?.id);
                DeleteHandle(parsed_data[0]?.id, parsed_data[0]?.handle);                
                DeleteHandle(parsed_data[1]?.id, parsed_data[1]?.handle);  
                const connected_flow = e_graph.getFlowById(parsed_data[0]?.id) || e_graph.getFlowById(parsed_data[1]?.id);
                const connected_comp = e_graph.getCompartmentById(parsed_data[0]?.id) || e_graph.getCompartmentById(parsed_data[1]?.id);   
                const is_to_comp = parsed_data[1]?.handle.search('flow') === -1;   
                if(is_to_comp){
                    let diff = connected_flow.GetToCompartmentCoef(connected_comp);
                    connected_flow.DeleteToCompartment(connected_comp)
                    ReturnDiffOfCoefs(connected_flow, diff);
                }
                else{
                    connected_flow.DeleteFromCompartment(connected_comp)
                }
                updateNodesByObjects(e_graph.GetComps());
                updateNodesByObjects(e_graph.GetFlows());
            }
            return applyEdgeChanges(changes, edg);
        }), [updateNodesByObjects]
    )


    const { x, y, zoom } = useViewport();
    const { fitView } = useReactFlow();

    useOnViewportChange({
        onEnd: (viewport) => setViewportState(viewport),
    });

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);


    const onDrop = useCallback(
        (event) => {
            event.preventDefault();
            const type = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            if(type === 'compartmentNode'){
                let comp = new Compartment(generate_uuid_v4(), { name: "testing", population: 1, x: position.x, y: position.y });
                const newNode = {
                    id: comp.GetId(),
                    type,
                    position: comp.GetPosition(),
                    data: {
                        population: comp.GetPopulation(),
                        name: comp.GetName(),
                        obj: comp,
                        ins: GenerateHandlesIds("target", "comp", comp.GetId().slice(0,6)),
                        outs: GenerateHandlesIds("source", "comp", comp.GetId().slice(0,6)),
                        corrected: true,
                    },
                };
                setAddingNode(newNode);
            }
            if(type === 'flowNode'){
                let flow = new Flow(generate_uuid_v4(), { to: [], coef: 0, x: position.x, y: position.y })
                const newNode = {
                    id: flow.GetId(),
                    type,
                    position: flow.GetPosition(),
                    data: {
                        obj: flow,
                        ins: GenerateHandlesIds("target", "flow", flow.GetId().slice(0,6)),
                        outs: GenerateHandlesIds("source", "flow", flow.GetId().slice(0,6)),
                        corrected: true,
                    }
                }
                setAddingNode(newNode);
            }
        },
        [e_graph, reactFlowInstance, setAddingNode],
    );



    const onNodeClick = useCallback(
        (event, node) => {
            event.preventDefault();
            setEditableProps({
                node: node
            })
        },
        [setEditableProps]
    )

    const onPaneCLick = useCallback(() => { setEditableProps(null); }, [setEditableProps])

    const onDeleteKeyCode = useCallback(() => { setEditableProps(null); return "Delete" }, [setEditableProps])

    const isViewState = !(viewportState === "view");

    const onNodesDelete = useCallback(
        (deleted) => {
            deleted.forEach((node) => {
                if (node.type === "compartmentNode") {
                    e_graph.DeleteComp(node.data.obj)
                }
                if (node.type === "flowNode"){
                    e_graph.DeleteFlow(node.data.obj)
                }
                setEditableProps(null)
            })
        }, [setEditableProps]
    )

    return (
        <>
            <ReactFlow
                nodeTypes={nodeTypes}
                nodes={nodes}
                edges={edges}
                onInit={setReactFlowInstance}
                onNodesChange={onNodesChange}
                onNodesDelete={onNodesDelete}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneCLick}
                onDrop={onDrop}
                onDragOver={onDragOver}


                deleteKeyCode={"Delete"}

                nodesDraggable={isViewState}
                nodesConnectable={isViewState}
                elementsSelectable={isViewState}
                selectNodesOnDrag={false}
                defaultViewport={viewportSettings}

            >

                <Background color="#aaa" gap={16} />
                <Controls />

            </ReactFlow>

        </>
    );

}


export default FlowTab;