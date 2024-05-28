// import libraries methodes
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, addEdge, useEdgesState, applyEdgeChanges, applyNodeChanges, useStore, ReactFlowProvider, useKeyPress } from 'reactflow';

// import styles
import 'reactflow/dist/style.css';
import './style/App.css';


// import debugers
import NodeInspector from './debugs/NodeInspector.js';

// import tabs
import SvgTab from './SvgTab';
import ResultsTab from './ResultsTab.js';
import FlowTab from './tabs/FlowTab.js';

// import modals
import SideBarAdding from './sidebars/left/SideBarAdding.js';
import SideBarEditable from './sidebars/editable/SideBarEditable';
import AddingModal from './modal/AddingModal.js';
import { OpenModal, NameAndTemplateModal } from './modal/OpenModal.js';
import Header from './header/Header';

// import nodes
import CompartmentNode from "./nodes/compartment/CompartmentNode.js"
import './nodes/compartment//style/CompartmentNodeStyle.css'

// import save methodes
import { saveFileToLocalStorage, saveFile, onSaveFileAs, checkIsHandleExist, getContentOfLastFile } from './handlers/Save.js';

// import graph methodes
import { EGraph } from './graph/graph.js';
import { svgConverterFunction } from './Svgconverter.js';
import { getInitialNodes, generateGraphClass } from './tabs/temp.js';
var dagre = require("@xdashduck/dagre-tlayering");

const fileExist = await checkIsHandleExist();


// initialize
let e_graph = new EGraph(null, await getContentOfLastFile());
let dagre_graph = new dagre.graphlib.Graph({ directed: true }).setGraph({ rankdir: "LR", ranksep: 10 });
let initialNodes = fileExist ? getInitialNodes(e_graph) : [];

const nodeTypes = { compartmentNode: CompartmentNode };



function App() {

  const crtlAndDPressed = useKeyPress(['Shift+f', 'Shift+F']);

  // state for debuger
  const [devView, setDevView] = useState(false);

  // for saving file
  
  
  // all modals
  const [isModalOpen, setIsModalOpen] = useState(!fileExist);
  const [isChooseFileNameModalOpen, setFileNameModalOpen] = useState(false);


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



  const onCreateClick = useCallback((state) => {
    setIsModalOpen(state);
    setFileNameModalOpen(!state);
  }, [setIsModalOpen, setFileNameModalOpen]);

  /**
   * Метод для создания нового файла путем вызова всплывающего окна
   */
  const createNewFile = useCallback((form_data) => {
    InitialStandartNodes();
    onSaveFileAs(
      e_graph.toJson(), 
      form_data.file_name + form_data.file_format, 
      () => {setFileNameModalOpen(false);}
    );
  }, [setFileNameModalOpen])


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
          onCreateClick();
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
          e_graph={e_graph}
          handleShowModel={setShowModelBtn}
          handleShowImage={setShowImageBtn}
          handleShowResults={setShowResultsBtn}
          onRunModel={runModel}
          handleOpenExisting={handleOpenExisting}
          setActiveTab={setActiveTab}

          setDevView={setDevView} devView={devView}

          viewportState={viewportState} setViewportState={updateViewportState}
        />
                {(devView)&& <NodeInspector/>}

            {isAddingModalOpen && <AddingModal
              isOpen={isAddingModalOpen}
              addingNode={addingNode}
              createGraphNode={setGraphNodesShare}
              closeModal={onCloseAddingModal}/>}

        <div className='reactflow_plane'>
          {adding_props && <SideBarAdding />}

          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            {/* все модальные окна */}
            {isChooseFileNameModalOpen && <NameAndTemplateModal isOpen={isChooseFileNameModalOpen} onCreate={createNewFile} onCancel={() => {onCreateClick(true);}}/>}
            {isModalOpen && <OpenModal isOpen={isModalOpen} onCreate={() => {onCreateClick(false);}} handleOpenExisting={handleOpenExisting} />}

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
              <ResultsTab e_graph={e_graph} />
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