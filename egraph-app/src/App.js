

import Header from './header/Header';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';

import 'reactflow/dist/style.css';

import CompartmentNode from "./nodes/compartment_node"
import './nodes/CompartmentNodeStyle.css'

import './style/App.css';
import Modal from './modal/Modal'; 
import { svgConverterFunction } from './Svgconverter.js';

import { getInitialNodes, generateGraphClass } from './tabs/temp.js';

let graphs = generateGraphClass();
let e_graph = graphs[0], dagre_graph = graphs[1];

let initialNodes = getInitialNodes(e_graph);
 
const nodeTypes = { compartmentNode: CompartmentNode };

function App() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('flow'); 
  const [svgContent, setSvgContent] = useState(''); // State for SVG content

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState(initialNodes);

  const [compartmentsObjects, setGraphCompartments, onGraphCompartmentChange] = useState(initialNodes);
  const [compartmentsUpdate, setCompartmentsUpdate] = useState([]);


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

  const onNodesChange = useCallback(
    (changes) => setGraphCompartments((nds) => applyNodeChanges(changes, nds)),
    [],
  )
  

  const updateNodesByObjects = (compartments) => {
    compartments.forEach(obj => {
      updateObject(obj.GetId(), obj.GetPopulation());
    });
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

  const runModel = async () => {
    for (let i = 0; i < 1; i++) {
      await delay(500);
      e_graph.onCompute(e_graph.GetStarted());
      updateNodesByObjects(e_graph.GetComps());
      console.log(e_graph.toJson());
    }
  }

  useEffect(() => {
    const svg = svgConverterFunction(dagre_graph);
    setSvgContent(svg);
    console.log(compartmentsUpdate);
    compartmentsUpdate.forEach(obj => {
      updateObject(obj.GetId(), obj.GetPopulation());
    });
  }, [compartmentsUpdate]);


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

        // Обновляем состояние компонентов на основе данных из файла
        setGraphCompartments(jsonData.compartments.map((compartment, index) => ({
          id: compartment.id,
          type: 'compartmentNode',
          position: { x: 100 + index * 100, y: 100 + index * 100 }, // Устанавливаем разные координаты для каждой ноды
          data: {
            population: compartment.population,
            name: compartment.name,
            obj: compartment // Здесь вы можете сохранить полный объект от файла, если нужно
          }
        })));

        // Обновляем состояние потоков на основе данных из файла (если нужно)
        // setGraphFlows(jsonData.flows);

        // Закрываем модальное окно
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
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={compartmentsObjects}
        onNodesChange={onNodesChange}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
      </ReactFlow>
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
