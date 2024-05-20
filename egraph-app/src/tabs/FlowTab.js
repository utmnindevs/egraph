import ReactFlow, { Controls, Background, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';


/**
 * Генерирует рендер вкладки конструирования модели, содержит методы манипуляции с ними:
 * Создание, редактирование, обновление узлов. 
 * TODO: Изначально генерация класса графа в App.js тут все манипуляции с графом как создание так и редактирование, поэтому
 * нужно перенести сюда все взаимодействия с графом, при этом App.js должен знать о том в каком состоянии граф + если граф меняется в App.js(
 * например загрузка файла, то этот документ должен подгрузить на себя эти изменения.)
 */
function FlowTab({ nodeTypes, nodes, onNodesChange }) {
    
    return (
        <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            onNodesChange={onNodesChange}>

            <Background color="#aaa" gap={16} />
            <Controls />
        </ReactFlow>
    );

}


export default FlowTab;