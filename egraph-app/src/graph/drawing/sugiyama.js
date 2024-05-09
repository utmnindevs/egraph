// function SugiyamaLayering(graph) {

//     //layering ---------------------------------
//     console.log(graph)
//     const layeredGraph = { layers: [] };

//     // all nodes without 'in' edges
//     const firstLayer = graph.nodes.filter(node => {
//         return !graph.edges.some(edge => edge.target === node.id);
//     });

//     layeredGraph.layers.push(firstLayer);

//     let currentLayerIndex = 0;

//     while (true) {
//         const currentLayer = layeredGraph.layers[currentLayerIndex];
//         const nextLayer = [];

//         for (const node of currentLayer) {
//             const adjacentNodes = graph.edges
//                 .filter(edge => edge.source === node.id)
//                 .map(edge => graph.nodes.find(n => n.id === edge.target));

//             for (const adjacentNode of adjacentNodes) {
//                 if (!nextLayer.includes(adjacentNode)) {
//                     nextLayer.push(adjacentNode);
//                 }
//             }
//         }

//         if (nextLayer.length === 0) {
//             break;
//         }

//         layeredGraph.layers.push(nextLayer);
//         currentLayerIndex++;
//     }


//     // optimization --------------------------
//     // minimization of 'x' view in edges

//     const optimizedLayeredGraph = { layers: [] };
//     optimizedLayeredGraph.layers.unshift(layeredGraph.layers[layeredGraph.layers.length-1])

//     //from down to up layers
//     for (let i = layeredGraph.layers.length - 1; i > 0; i--) {
//         const current_layer = layeredGraph.layers[i]; // текущйи слой
//         const upper_layer = layeredGraph.layers[i - 1]; // слой выше

//         for (const upper_node of upper_layer) {
//             // get nodes if current layer nodes have edges with upper
//             const connectedLowerNodes = current_layer.filter(node => {
//                 return upper_layer.some(nextNode => {
//                     return graph.edges.some(edge => edge.source === nextNode.id && edge.target === node.id);
//                 });
//             });


//             //sorting nodes in this layer where is lower nodes connected with upper
//             upper_node.connectedLowerNodes = connectedLowerNodes;
//             upper_node.connectedLowerNodes.sort((a, b) => {
//                 return a.connectedLowerNodes.length - b.connectedLowerNodes.length; // by ierarchy
//             });
//         }

//         // get upper layer with sorted lowers nodes and sort uppers
//         const sortedUpperLayer = upper_layer.slice().sort((a, b) => {
//             return a.connectedLowerNodes.length - b.connectedLowerNodes.length;
//         });

//         optimizedLayeredGraph.layers.unshift(sortedUpperLayer);
//     }
//     console.log({optimized: optimizedLayeredGraph})
//     // coordinate assigment --------------------------------

//     const nodeCoordinates = {};

//     optimizedLayeredGraph.layers.forEach(function (layer, i){
//         const vertical_spacing = i*200+100;

//         // set coordinates
//         layer.forEach(function (node, j){
//             console.log(j*vertical_spacing)
//             const xCoordinate = vertical_spacing;
//             const yCoordinate = j* vertical_spacing + 100;
//             nodeCoordinates[node.id] = { x: xCoordinate, y: yCoordinate };
//         })
//     })
//     console.log({coordinates: nodeCoordinates})

//     //poistion assigment ----------------------------------

//     const adjustedNodeCoordinates = JSON.parse(JSON.stringify(nodeCoordinates));

//     // for (let i = 0; i < optimizedLayeredGraph.layers.length; i++) {
//     //     const layer = optimizedLayeredGraph.layers[i];
//     //     for (let j = 0; j < layer.length; j++) {
//     //         const node = layer[j];

//     //         // get new coordinate y by neights
//     //         const neighbors = graph.edges
//     //             .filter(edge => edge.target === node.id)
//     //             .map(edge => graph.nodes.find(n => n.id === edge.source));

//     //         const upper_neights = graph.edges
//     //             .filter(edge => edge.target === node.id)
//     //             .map(edge => graph.nodes.find(n => n.id === edge.source));

//     //         const down_neight = graph.edges
//     //             .filter(edge => edge.source === node.id)
//     //             .map(edge => graph.nodes.find(n => n.id === edge.target));
            
//     //         console.log({node: node, up: upper_neights, down: down_neight})
//     //         if(upper_neights.length > 0 || down_neight.length > 0){
//     //             console.log(upper_neights.reduce((sum, neighbor) => sum + adjustedNodeCoordinates[neighbor.id].y, 0))
//     //             const upper_summary = upper_neights.length > 0 ? upper_neights.reduce((sum, neighbor) => sum + adjustedNodeCoordinates[neighbor.id].y, 0) / upper_neights.length : 0;
//     //             const down_summary = down_neight.length > 0 ? down_neight.reduce((sum, neighbor) => sum + adjustedNodeCoordinates[neighbor.id].y, 0) / down_neight.length : 0;
                
//     //             adjustedNodeCoordinates[node.id].y = (upper_summary + down_summary);
//     //         }

//     //         // if (neighbors.length > 0) {
//     //         //     const averageY = neighbors.reduce((sum, neighbor) => sum + adjustedNodeCoordinates[neighbor.id].x, 0) / neighbors.length;
//     //         //     adjustedNodeCoordinates[node.id].x = averageY;
//     //         // }
//     //     }
//     // }
//     // console.log({adjusted: adjustedNodeCoordinates})

//     // routing graph -----------------------------------

//     const routedGraph = { nodes: [], edges: [] };

//     graph.nodes.forEach(node => routedGraph.nodes.push({ ...node }));
//     graph.edges.forEach(edge => routedGraph.edges.push({ ...edge }));

//     for (var edge of routedGraph.edges) {
//         const sourceNode = adjustedNodeCoordinates[edge.source];
//         const targetNode = adjustedNodeCoordinates[edge.target];

//         edge.points = [
//             { x: sourceNode.x, y: sourceNode.y },
//             { x: targetNode.x, y: targetNode.y },
//         ];

//         // в статье как раз таки модифицированный метод Сугиямы описывает логику здесь.
//     }

//     console.log({routed: routedGraph})

//     return adjustedNodeCoordinates;
// }

// export {SugiyamaLayering};