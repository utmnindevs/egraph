import Header from './header/Header';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, addEdge, useEdgesState, applyEdgeChanges, applyNodeChanges, useStore, ReactFlowProvider } from 'reactflow';

import 'reactflow/dist/style.css';

import CompartmentNode from "./nodes/compartment/CompartmentNode.js"
import './nodes/compartment//style/CompartmentNodeStyle.css'

import SvgTab from './SvgTab';
import Results from './ResultsTab.js';
import './style/App.css';
import OpenModal from './modal/OpenModal.js';
import AddingModal from './modal/AddingModal.js';
import { svgConverterFunction } from './Svgconverter.js';
import ResultsTab from './ResultsTab.js';

import FlowTab from './tabs/FlowTab.js';
import SideBarEditable from './sidebars/editable/SideBarEditable';


import { getInitialNodes, generateGraphClass } from './tabs/temp.js';
import { EGraph } from './graph/graph.js';
import SideBarAdding from './sidebars/left/SideBarAdding.js';
import Modal from './modal/Modal.js';
var dagre = require("@xdashduck/dagre-tlayering");


let e_graph = new EGraph();
let dagre_graph = new dagre.graphlib.Graph({ directed: true }).setGraph({ rankdir: "LR", ranksep: 10 });

let initialNodes = [];

const nodeTypes = { compartmentNode: CompartmentNode };



function App() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('flow');
  const [svgContent, setSvgContent] = useState('');

  const [showModelBtn, setShowModelBtn] = useState(false);
  const [showImageBtn, setShowImageBtn] = useState(false);
  const [showResultsBtn, setShowResultsBtn] = useState(false);


  const reactFlowWrapper = useRef(null);

  // Для всех модальных окон
  const [isModalOpne, setModalOpen] = useState(false);



  const [nodes, setNodes] = useState(initialNodes);

  const [compartmentsObjects, setGraphCompartments, onGraphCompartmentChange] = useState(initialNodes);
  const [compartmentsUpdate, setCompartmentsUpdate] = useState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = useCallback((params) => setEdges((els) => addEdge({ ...params }, els)), []);

  const [editableProps, setEditableProps] = useState(null);


  // Состояние для нижнего меню и переключение режима просмотра и редактирования
  const [viewportState, setViewportState] = useState("view");


  /**
   * Состояния для добавления новых узлов
   */
  const [isAddingModalOpen, setAddingModalOpen] = useState(false);
  const [addingNode, setAddingNode] = useState(null);
  
  // Расшаренная установка создаваемого узла с установлением выключения/включения модального окна для редактирования
  const setAddingNodeShare = useCallback((node) => {
    if(node){ setAddingModalOpen(true); }
    else{ setAddingModalOpen(false); }
    setAddingNode(node);
  }, [setAddingNode, setAddingModalOpen])

  // Расшаренная установка обновления и добавления нового узла если такой был создан
  const setGraphNodesShare = useCallback(() => {
    if(addingNode) {
      const comp = addingNode.data.obj;
      e_graph.AddComp(comp.GetId(), {name: comp.GetName(), population: comp.GetPopulation()});
      setGraphCompartments((nds) => nds.concat(addingNode));
      setAddingNodeShare(null);
      updateNodesByObjects(e_graph.GetComps());
    }
  }, [setGraphCompartments, addingNode])

  // Метод вызываемый при отмене создания нового узла
  const onCloseAddingModal = useCallback(() => {
    setAddingNode(null); setAddingModalOpen(false);
  }, [setAddingNode, setAddingModalOpen]);

  /**
   * Улучшенный метод обновления состояния и вызвова окна редактирования с проверкой на текущее состояние
   * всего viewport'а т.е. на то что включен режим "редактирования"
   */
  const updateEditableProps = useCallback((state) => {
    if (viewportState === "edit") {
      setEditableProps(state);
    }
    else {
      setEditableProps(null);
    }
  }, [setEditableProps, viewportState])

  const [adding_props, setAddingProps] = useState(null);



  const updateViewportState = useCallback((new_state) => {
    setViewportState(new_state);
    if (new_state === "view") {
      setEditableProps(null);
      setAddingProps(null);
    }
    if (new_state === "edit") {
      setAddingProps(true)
    }
  }, [setViewportState, setEditableProps])



  const handleCloseModal = () => {
    InitialStandartNodes();
    setIsModalOpen(false);
  };

  const InitialStandartNodes = () => {
    let graphs = generateGraphClass();
    e_graph = graphs[0];
    dagre_graph = graphs[1];
    const svg = svgConverterFunction(dagre_graph);
    setSvgContent(svg);
    setGraphCompartments(getInitialNodes(e_graph));
  };

  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );


  useEffect(() => {
    const svg = svgConverterFunction(dagre_graph);
    setSvgContent(svg);
    compartmentsUpdate.forEach(obj => {
      updateObject(obj.GetId(), { pop: obj.GetPopulation(), name: obj.GetName() });
    });
  }, [compartmentsUpdate]);

  const updateNodesByObjects = (compartments) => {
    compartments.forEach(obj => {
      updateObject(obj.GetId(), { pop: obj.GetPopulation(), name: obj.GetName() });
    });
  };

  const onNodesChange = useCallback(
    (changes) => setGraphCompartments(
      (nds) => applyNodeChanges(changes, nds)),
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
          obj.data = { ...obj.data, population: newValues.pop, name: newValues.name };
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
      if (!file) return;

      const fileName = file.name.toLowerCase();
      if (fileName.endsWith('.json')) {
        try {
          const fileContent = await file.text();
          const jsonData = JSON.parse(fileContent);
          console.log(jsonData)

          // инициализация конечно есть, но проблема в том, что 
          // svg не работает при открытии нового, + не добавляется и не конструируется EGraph класс и его сокурсник в виде dagre
          setGraphCompartments(jsonData.compartments.map((compartment, index) => ({
            id: compartment.id,
            type: 'compartmentNode',
            position: compartment.position || { x: 100 + index * 100, y: 100 + index * 100 },
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

  /**
   * @param {string} state - название экрана
   */
  const setActiveTabWithReset = useCallback((state) => {
    setEditableProps(null);
    setActiveTab(state);
  }, [setActiveTab, setEditableProps])

  return (
    <ReactFlowProvider>
      <div className="reactflow-body">
        <Header
          handleShowModel={setShowModelBtn}
          handleShowImage={setShowImageBtn}
          handleShowResults={setShowResultsBtn}
          onDownloadFile={downloadFile}
          onRunModel={runModel}
          handleOpenExisting={handleOpenExisting}
          setActiveTab={setActiveTab}



          viewportState={viewportState} setViewportState={updateViewportState}
        />
            {isAddingModalOpen && <AddingModal
              isOpen={isAddingModalOpen}
              addingNode={addingNode}
              createGraphNode={setGraphNodesShare}
              closeModal={onCloseAddingModal}/>}

        <div className='reactflow_plane'>
          {adding_props && <SideBarAdding />}

          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            {/* все модальные окна */}
            {isModalOpen && <OpenModal isOpen={isModalOpen} onClose={handleCloseModal} handleOpenExisting={handleOpenExisting} />}
            <div className="tab-buttons">
              {showModelBtn && <button className={activeTab === 'flow' ? 'active' : ''} onClick={() => setActiveTabWithReset('flow')}>Модель</button>}
              {showImageBtn && <button className={activeTab === 'image' ? 'active' : ''} onClick={() => setActiveTabWithReset('image')}>Изображение</button>}
              {showResultsBtn && <button className={activeTab === 'results' ? 'active' : ''} onClick={() => setActiveTabWithReset('results')}>Результаты</button>}
            </div>

            {activeTab === 'flow' && (
              <FlowTab
                e_graph={e_graph}
                nodeTypes={nodeTypes}
                nodes={compartmentsObjects}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                setEditableProps={updateEditableProps}

                setAddingNode={setAddingNodeShare}

                updateNodesByObjects={updateNodesByObjects}

                viewportState={viewportState} />
            )}
            {activeTab === 'image' && (
              <SvgTab svgContent={svgContent} />
            )}
            {activeTab === 'results' && (
              <ResultsTab />
            )}
          </div>
          {/* Где-то вызывается много раз side bar из-за чего возможно и не появляются новые данные */}
          {editableProps && <SideBarEditable {...editableProps}
            setStateMenu={updateEditableProps}
            e_graph={e_graph}
            updateGraphNodes={updateNodesByObjects}
            setGraphNodes={setGraphCompartments} />}

        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;