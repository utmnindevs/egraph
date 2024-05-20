

import Header from './header/Header';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';

import 'reactflow/dist/style.css';

import CompartmentNode from "./nodes/compartment_node"
import './nodes/CompartmentNodeStyle.css'


import './style/App.css';
import Modal from './modal/Modal';
import { svgConverterFunction } from './Svgconverter.js';

import FlowTab from './tabs/FlowTab.js';

import { getInitialNodes, generateGraphClass } from './tabs/temp.js';
import { EGraph } from './graph/graph.js';
var dagre = require("@xdashduck/dagre-tlayering");


let e_graph = new EGraph();
// TODO: перенести dagre в класс EGRAPH
let dagre_graph = new dagre.graphlib.Graph({directed:true}).setGraph({rankdir: "LR", ranksep: 10});
// let e_graph = graphs[0], dagre_graph = graphs[1];

let initialNodes = [];

const nodeTypes = { compartmentNode: CompartmentNode };


function App() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('flow');
  const [svgContent, setSvgContent] = useState(''); // State for SVG content


  const [nodes, setNodes] = useState(initialNodes);

  const [compartmentsObjects, setGraphCompartments, onGraphCompartmentChange] = useState(initialNodes);
  const [compartmentsUpdate, setCompartmentsUpdate] = useState([]);

  const handleCloseModal = () => {
    InitialStandartNodes();
    setIsModalOpen(false);
  };

  const InitialStandartNodes = () => {
    let graphs = generateGraphClass();
    e_graph = graphs[0];
    dagre_graph = graphs[1];
    setGraphCompartments(getInitialNodes(e_graph));
  };

  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

  const reactFlowWrapper = useRef(null);

  useEffect(() => {
    const svg = svgConverterFunction(dagre_graph);
    setSvgContent(svg);
    compartmentsUpdate.forEach(obj => {
      updateObject(obj.GetId(), obj.GetPopulation());
    });
  }, [compartmentsUpdate]);

  const updateNodesByObjects = (compartments) => {
    compartments.forEach(obj => {
      updateObject(obj.GetId(), obj.GetPopulation());
    });
  };

  const onNodesChange = useCallback(
    (changes) => setGraphCompartments((nds) => applyNodeChanges(changes, nds)),
    [],
  )

  const runModel = async () => {
    for (let i = 0; i < 1; i++) {
      await delay(500);
      e_graph.onCompute(e_graph.GetStarted());
      updateNodesByObjects(e_graph.GetComps());
    }
  }

  const updateObject = (objectId, newValues) => {
    setGraphCompartments(graphObjects => {
      return graphObjects.map(obj => {
        if (obj.id === objectId) {
          obj.data = { ...obj.data, population: newValues };
        }
        return obj;
      });
    }, []);
  };

  const downloadFile = () => {
    const fileName = "my-file";
    const json = e_graph.toJson();
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  }





  const handleOpenExisting = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.addEventListener('change', async event => {
      const file = event.target.files[0];

      const fileName = file.name.toLowerCase();
      if (fileName.endsWith('.json')) {
        try {
          const fileContent = await file.text();
          const jsonData = JSON.parse(fileContent);

          // инициализация конечно есть, но проблема в том, что 
          // svg не работает при открытии нового, + не добавляется и не конструируется EGraph класс и его сокурсник в виде dagre
          setGraphCompartments(jsonData.compartments.map((compartment, index) => ({
            id: compartment.id,
            type: 'compartmentNode',
            position: { x: 100 + index * 100, y: 100 + index * 100 },
            data: {
              population: compartment.population,
              name: compartment.name,
              obj: compartment
            }
          })));
          handleCloseModal();
        } catch (error) {
          console.error('Ошибка при чтении файла JSON:', error);
          alert('Ошибка при чтении файла JSON. Пожалуйста, убедитесь, что файл содержит корректные данные.');
        }
      } else {
        alert('Пожалуйста, выберите файл с расширением .json');
      }
    });

    input.click();
  };

  return (
    <div className="reactflow-wrapper" ref={reactFlowWrapper}>
      <Header onDownloadFile={downloadFile} onRunModel={runModel} handleOpenExisting={handleOpenExisting} />
      {isModalOpen && <Modal isOpen={isModalOpen} onClose={handleCloseModal} handleOpenExisting={handleOpenExisting} />}

      <div className="tab-buttons">
        <button className={activeTab === 'flow' ? 'active' : ''} onClick={() => setActiveTab('flow')}>Модель</button>
        <button className={activeTab === 'future' ? 'active' : ''} onClick={() => setActiveTab('future')}>Результат</button>
      </div>

      {activeTab === 'flow' ? (
        <FlowTab nodeTypes={nodeTypes}
          nodes={compartmentsObjects}
          onNodesChange={onNodesChange} />
      ) : (
        <div className="future-workspace" style={{ height: '500px', width: '800px', border: '1px solid #ccc' }}>
          <div dangerouslySetInnerHTML={{ __html: svgContent }} />
        </div>
      )}
    </div>
  );
}

// export { dagre_graph };
export default App;
