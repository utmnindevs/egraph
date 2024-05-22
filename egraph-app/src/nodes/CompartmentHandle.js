
import './CompartmentHandle.css';

import React, { useCallback, useMemo } from 'react';
import { getConnectedEdges, Handle, useNodeId, useStore } from 'reactflow';

const selector = (s) => ({
    nodeInternals: s.nodeInternals,
    edges: s.edges,
});

/**
 * Хендл для компартментов, ограничивающий подключение узлов других компартментов и кол-во доступных подключений в одну
 * ячейку до 1 кол-ва
 * @param {*} props 
 * @returns 
 */
const CompartmentHandle = (props) => {
    const { nodeInternals, edges } = useStore(selector);
    const nodeId = useNodeId();

    const isHandleConnectionValid = (connection) => {
        const node = nodeInternals.get(nodeId);
        if(node.id === connection.target && node.id === connection.source){
            return false;
        }
        const connectedEdges = getConnectedEdges([node], edges);
        if(connectedEdges.length > 0){
            return connectedEdges.filter((edge) => {
                const this_connactable = (edge.sourceHandle === connection.sourceHandle || edge.targetHandle === connection.targetHandle);
                const next_connactable = edges.filter((edge) => {return edge.sourceHandle === connection.sourceHandle}).length != 0;
                return this_connactable || next_connactable;
            }).length < 1;            
        }
        else {
            return edges.filter((edge) => {
                return edge.targetHandle === connection.targetHandle || edge.sourceHandle === connection.sourceHandle;
            }).length < 1 && connection.targetHandle.includes('flow_target') // тут нужно заменить на разрешение подключение потоков
        }    
    };

    return (
        <Handle {...props} isValidConnection={isHandleConnectionValid} ></Handle>
    );
};

export default CompartmentHandle;