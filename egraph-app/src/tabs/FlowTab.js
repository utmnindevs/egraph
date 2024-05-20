

function FlowTab(){


return(
    <ReactFlow
        nodeTypes={nodeTypes}
        nodes={compartmentsObjects}
        onNodesChange={onNodesChange}>


    <Background color="#aaa" gap={16} />
    <Controls />
    </ReactFlow>
);

}


export default FlowTab;