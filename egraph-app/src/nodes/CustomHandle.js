
import './CustomHandle.css';

import React, { useCallback, useMemo } from 'react';
import { getConnectedEdges, Handle, useNodeId, useStore } from 'reactflow';

const selector = (s) => ({
    nodeInternals: s.nodeInternals,
    edges: s.edges,
});

const isValidConnection = (connection) => connection.targetHandle.includes('compartment_handle');


const CustomHandle = (props) => {
    const { nodeInternals, edges } = useStore(selector);
    const nodeId = useNodeId();

    const isHandleConnectable = useMemo(() => {
        if (typeof props.isConnectable === 'function') {
            const node = nodeInternals.get(nodeId);
            const connectedEdges = getConnectedEdges([node], edges);

            return props.isConnectable({ node, connectedEdges });
        }

        if (typeof props.isConnectable === 'number') {
            const node = nodeInternals.get(nodeId);
            const connectedEdges = getConnectedEdges([node], edges);

            // connectedEdges.forEach((edge, index) => {
            //     if(edge.sourceHandle == )
            // })
            return connectedEdges.length < props.isConnectable;
        }

        return props.isConnectable;
    }, [nodeInternals, edges, nodeId, props.isConnectable]);

    // const isHandleConnectionValid = ((connection) => {
    //     const node = nodeInternals.get(nodeId);
    //     const connectedEdges = getConnectedEdges([node], edges);
    //     connectedEdges.forEach((edge) => {
    //         if(edge.sourceHandle === connection.sourceHandle || edge.targetHandle === connection.targetHandle){
    //             return false;
    //         }
    //         return true && props.isValidConnection;
    //     })
    //     return props.isValidConnection;
    // })

    const isHandleConnectionValid = (connection) => {
        const node = nodeInternals.get(nodeId);
        if(node.id === connection.target){
            return false;
        }
        // const connectedEdges = getConnectedEdges([node], edges);
        // connectedEdges.forEach((edge) => {
        //     if(edge.sourceHandle === connection.sourceHandle || edge.targetHandle === connection.targetHandle){
        //         return false;
        //     }
        // })

        return connection.targetHandle.includes('compartment_handle')
    
    };

    return (
        <Handle {...props} isValidConnection={isHandleConnectionValid} ></Handle>
    );
};

export default CustomHandle;