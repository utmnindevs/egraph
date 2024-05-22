import { useCallback } from 'react';
import ReactFlow, { Controls, Background, addEdge, applyEdgeChanges, applyNodeChanges, useReactFlow, getConnectedEdges } from 'reactflow';

import SideBarEditable from '../sidebars/editable/SideBarEditable';

/**
 * Генерирует рендер вкладки конструирования модели, содержит методы манипуляции с ними:
 * Создание, редактирование, обновление узлов. 
 * TODO: Изначально генерация класса графа в App.js тут все манипуляции с графом как создание так и редактирование, поэтому
 * нужно перенести сюда все взаимодействия с графом, при этом App.js должен знать о том в каком состоянии граф + если граф меняется в App.js(
 * например загрузка файла, то этот документ должен подгрузить на себя эти изменения.)
 */
function FlowTab({ e_graph, edges, nodeTypes, nodes, onNodesChange, onEdgesChange, onConnect, setEditableProps }) {
    
    const onNodeClick = useCallback(
        (event, node) =>{
            if(node.type === 'compartmentNode'){
                event.preventDefault();
                setEditableProps({
                    node: node
                })
            }
        },
        [setEditableProps]
    )

    const onPaneCLick = useCallback(() => {setEditableProps(null);}, [setEditableProps])

    return (
        <>
        <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneCLick}>

            <Background color="#aaa" gap={16} />
            <Controls />

        </ReactFlow>
        </>
    );

}


export default FlowTab;