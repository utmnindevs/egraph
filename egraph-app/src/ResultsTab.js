
import React from 'react';

function ResultsTab({ e_graph }) {
  const edge_node_graph = e_graph.toNodeEdgeGraph();
  return (
    <div className="results-workspace" style={{ }}>
      <p>
        {
          Array.from({length: edge_node_graph.nodes.length}, (_, index) => {
            return (
              <>
                <div className='node'>
                  Compartment: {'{'}
                  id: {edge_node_graph.nodes[index]?.id_} 
                  ,name: {edge_node_graph.nodes[index]?.name_} 
                  ,pop.: {edge_node_graph.nodes[index]?.population_}
                  ,x: {edge_node_graph.nodes[index]?.x_}
                  ,y: {edge_node_graph.nodes[index]?.y_}
                  {'}'}
                </div>
              </>
            )
          })
        }
        {
          Array.from({length: edge_node_graph.edges.length}, (_, index) => {
            return (
              <>
                <div className='flow'>
                  Flow: {'{'}{edge_node_graph.edges[index].v?.name_ || 'null'} {'->'} {edge_node_graph.edges[index].w?.name_ || 'null'}{'}'}
                </div>
              </>
            )
          })
        }
      </p>
    </div>
  );
};

export default ResultsTab;
