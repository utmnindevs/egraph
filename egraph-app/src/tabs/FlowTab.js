import React, { useCallback, useState } from 'react';
import ReactFlow, { Controls, Background, ReactFlowProvider, useStore } from 'reactflow';

import SideBarEditable from '../sidebars/editable/SideBarEditable';
import { generate_uuid_v4 } from '../graph/helpers';
import { EGraph } from '../graph/graph';

import ErrorModal from '../modal/ErrorModal';
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
    onConnect, 
    setEditableProps, 
    setGraphNodes,
    updateNodesByObjects,
    viewportState }) {

    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    

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

            e_graph.AddComp(generate_uuid_v4(), {name: "testing", population: 1});
            // TODO: Решить баг с тем, что хендлеры ху*во работают
            let comp = e_graph.getCompartmentByName("testing");
            const newNode = {
                id: comp.GetId(),
                type,
                position,
                data: { 
                    population: comp.GetPopulation(),
                    name: comp.GetName(),
                    obj: comp,
                    ins: 1,
                    outs: 1
                 },
            };

            setGraphNodes((nds) => nds.concat(newNode));
        },
        [e_graph, reactFlowInstance],
    );

    

    const onNodeClick = useCallback(
        (event, node) => {
            if (node.type === 'compartmentNode') {
                event.preventDefault();
                setEditableProps({
                    node: node
                })
            }
        },
        [setEditableProps]
    )

    const onPaneCLick = useCallback(() => { setEditableProps(null); }, [setEditableProps])

    const onDeleteKeyCode = useCallback(() => {setEditableProps(null); return "Delete"}, [setEditableProps])

    const isViewState = !(viewportState === "view");



    return (
        <>
            <ReactFlow
                nodeTypes={nodeTypes}
                nodes={nodes}
                edges={edges}
                onInit={setReactFlowInstance}
                onNodesChange={onNodesChange}
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


                >

                <Background color="#aaa" gap={16} />
                <Controls />

            </ReactFlow>
        </>
    );

}


export default FlowTab;