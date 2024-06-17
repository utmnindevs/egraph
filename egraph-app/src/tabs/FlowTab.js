import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, { Controls, Background, ReactFlowProvider, useStore, useReactFlow, useNodes, useViewport, useOnViewportChange } from 'reactflow';
import { getConnectedEdges, useNodeId, useUpdateNodeInternals, useEdges, addEdge } from 'reactflow';


import SideBarEditable from '../sidebars/editable/SideBarEditable';
import { generate_uuid_v4 } from '../graph/helpers';
import { EGraph } from '../graph/graph';

import { Compartment } from '../graph/compartment';

import { ParseConstructHandleId, ConstructHandleId } from './temp';



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
    onEdgesChange,
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
   * Метод добавления новой ячейки.
   */
    const AddNewHandle = useCallback((node_id, handle_id) => {
        const parsed_handle_id = ParseConstructHandleId(handle_id);
        setGraphObjects(graphObjects => {
            return graphObjects.map(obj => {
                const obj_id = obj?.id;
                if (node_id === obj_id) {
                    if (parsed_handle_id[2] === 'source') {
                        const sources_edges = getConnectedEdges([obj], edg).filter(edge => {return edge.source === obj_id});
                        console.log('sources', sources_edges.length);
                        if(sources_edges.length + 1 === obj?.data?.outs.length){
                            obj?.data?.outs.push(ConstructHandleId(obj?.data?.outs.length, 'source', obj?.type.slice(0, 4), node_id.slice(0, 6)));
                        }
                    }
                    else if (parsed_handle_id[1] != 'flow') {
                        const targets_edges = getConnectedEdges([obj], edg).map(edge => {if(edge.target === obj_id){return edge}});
                        console.log('targets', targets_edges.length);

                        if(targets_edges.length + 1 === obj?.data?.ins.length){
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

    const onConnect = useCallback((params) => {
        setEdges((els) => addEdge({ ...params }, els))
        AddNewHandle(params?.source, params?.sourceHandle);
        AddNewHandle(params?.target, params?.targetHandle);
    }, [AddNewHandle]
    );


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

            let comp = new Compartment(generate_uuid_v4(), { name: "testing", population: 1, x: position.x, y: position.y });
            // TODO: Решить баг с тем, что хендлеры ху*во работают
            const newNode = {
                id: comp.GetId(),
                type,
                position: comp.GetPosition(),
                data: {
                    population: comp.GetPopulation(),
                    name: comp.GetName(),
                    obj: comp,
                    ins: 1,
                    outs: 1
                },
            };

            setAddingNode(newNode);
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