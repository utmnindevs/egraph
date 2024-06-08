import React from 'react';
import GraphTest from '../graph_test';

test("correct counts", () => {
    let graph_test = new GraphTest();
    const e_graph = graph_test.GetGraph();
    
    graph_test.InitStages(5, 10); 
    expect(e_graph.GetComps().size).toBe(5);

    graph_test.DeleteStages(110); // Check if anything count delete.
    expect(e_graph.GetComps().size).toBe(0);
})