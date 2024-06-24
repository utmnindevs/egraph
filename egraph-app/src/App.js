// import libraries methodes
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  Controls, Background, addEdge,
  useEdgesState, applyEdgeChanges, applyNodeChanges,
  useStore, ReactFlowProvider, useKeyPress, useReactFlow, useOnViewportChange, useNodes, getConnectedEdges, useEdges
} from 'reactflow';

// import styles
import 'reactflow/dist/style.css';
import './style/App.css';


// import debugers
import NodeInspector from './debugs/NodeInspector.js';

// import tabs
import SvgTab from './tabs/SvgTab';
import ResultsTab from './ResultsTab.js';
import FlowTab from './tabs/FlowTab.js';

// import modals
import SideBarAdding from './sidebars/left/SideBarAdding.js';
import SideBarEditable from './sidebars/editable/SideBarEditable';
import AddingModal from './modal/AddingModal.js';
import { OpenModal, NameAndTemplateModal } from './modal/OpenModal.js';
import Header from './header/Header';
import { ChooseStorageModal } from './modal/ChooseStorageModal';
import MetaDataModal from './modal/MetaDataModal.tsx';

// import nodes
import CompartmentNode from "./nodes/compartment/CompartmentNode.js"
import FlowNode from './nodes/flow/FlowNode.js';

// import save methodes
import { onSaveFileAs, checkIsHandleExist, getContentOfLastFile, openFile, getRecentFile } from './handlers/Save.js';

// import graph methodes
import { EGraph } from './graph/graph.js';
import { svgConverterFunction } from './Svgconverter.ts';
import { getInitialNodes, generateGraphClass, ConstructHandleId, ParseConstructHandleId, getInitialEdges } from './tabs/temp.js';
import LocalStorage from './handlers/LocalStorage';
var dagre = require("@xdashduck/dagre-tlayering");

const fileExist = await checkIsHandleExist();


// initialize
let e_graph = new EGraph(null, await getContentOfLastFile()); // -> useState mb nice
let dagre_graph = new dagre.graphlib.Graph({ directed: true }).setGraph({ rankdir: "LR", ranksep: 10 });
let initialNodes = fileExist ? getInitialNodes(e_graph) : []
let initialEdges = fileExist ? getInitialEdges(e_graph, initialNodes) : []

const nodeTypes = { compartmentNode: CompartmentNode, flowNode: FlowNode };

let viewportSettings_ = undefined; // базовая настройка вьюпорта, временная
const LS_CONFIG = ".user_config"
const localStorageShare = new LocalStorage();



function App() {




  const reactFlowWrapper = useRef(null);
  const [viewportSettings, setViewportSettings] = useState(viewportSettings_);

  const [storagePlace, setStoragePlace] = useState("device");
  const [isStorageView, setStorageView] = useState(false);

  const setStorageViewShare = useCallback((state) => {
    setStorageView(state);
    setIsModalOpen(!state);
  })
  const setStoragePlaceShare = useCallback((type) => {
    localStorageShare.SavePropTo(LS_CONFIG, JSON.stringify({ "type": type }))
    setStoragePlace(type);
    setStorageViewShare(false);
  }, [setStoragePlace, setStorageViewShare])


  // state for debuger
  const [devView, setDevView] = useState(false);

  // all modals
  const [isModalOpen, setIsModalOpen] = useState(!fileExist);
  const [isChooseFileNameModalOpen, setFileNameModalOpen] = useState(false);
  const [isMetaDataModalOpen, setMetaDataModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState('flow');

  const [showModelBtn, setShowModelBtn] = useState(false);
  const [showImageBtn, setShowImageBtn] = useState(false);
  const [showResultsBtn, setShowResultsBtn] = useState(false);


  const [isModalOpne, setModalOpen] = useState(false);


  const [graphObjects, setGraphObjects, onGraphObjectChange] = useState(initialNodes);
  const [objectsUpdate, setObjectsUpdate] = useState([]);
  const [edges, setEdges] = useEdgesState(initialEdges);


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
    if (node) { setAddingModalOpen(true); }
    else { setAddingModalOpen(false); }
    setAddingNode(node);
  }, [setAddingNode, setAddingModalOpen])


  // Расшаренная установка обновления и добавления нового узла если такой был создан
  const setGraphNodesShare = useCallback(() => {
    if(!addingNode) {return;}

    const type_node = addingNode.type;
    switch(type_node){
      case "flowNode":
        const flow = addingNode.data.obj;
        const f_position = flow.GetPosition();
        e_graph.AddFlow(flow.GetId(), {from: null, to: [], coef: flow.GetCoef(), coef_name: flow.GetCoefName(), x: f_position?.x, y: f_position?.y});
        addingNode.data.obj = e_graph.getFlowById(flow.GetId());
        break;
      case "compartmentNode":
        const comp = addingNode.data.obj;
        const position = comp.GetPosition();
        e_graph.AddComp(comp.GetId(), { name: comp.GetName(), population: comp.GetPopulation(), x: position?.x, y: position?.y });
        addingNode.data.obj = e_graph.getCompartmentByName(comp.GetName());
        break;
      default:
        throw "Undefined node type";
    }
    setGraphObjects((nds) => nds.concat(addingNode));
    updateNodesByObjects(new Map([...e_graph.GetComps(), ...e_graph.GetFlows()]));
    setAddingNodeShare(null);
    console.log(e_graph)
  }, [setGraphObjects, addingNode])

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
    setIsModalOpen(state && (getRecentFile() === null));
    setFileNameModalOpen(!state);
  }, [setIsModalOpen, setFileNameModalOpen]);

  /**
   * Метод для создания нового файла путем вызова всплывающего окна
   */
  const createNewFile = useCallback((form_data) => {
    localStorageShare.SavePropTo(".current_files", JSON.stringify({ name: form_data.file_name + form_data.file_format }));
    // InitialStandartNodes();
    // onSaveFileAs(
    //   e_graph.toJson(),
    //   form_data.file_name + form_data.file_format,
    //   () => { setFileNameModalOpen(false); }
    // );
    setFileNameModalOpen(false);
    setMetaDataModalOpen(true);
  }, [setFileNameModalOpen, setMetaDataModalOpen])

  const createOrSkipMetdata = useCallback(() => {
    onSaveFileAs(
      e_graph.toJson(),
      JSON.parse(localStorageShare.GetPropFrom(".current_files"))?.name,
      () => { setMetaDataModalOpen(false); }
    );
    InitialStandartNodes();
    // TODO: дописать ловью метаданных
  })


  const InitialStandartNodes = useCallback(() => {
    let graphs = generateGraphClass();
    e_graph = graphs[0];
    const init_nodes = getInitialNodes(e_graph);
    setGraphObjects(init_nodes);
    const init_edges = getInitialEdges(e_graph, init_nodes);
    setEdges(init_edges)

  }, [setEdges, setGraphObjects]);

  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );


  const updateNodesByObjects = (objects) => {
    objects.forEach(obj => {
      updateObject(obj);
    });
  };

  const updateEdge = (edgeGraph) => {
    setEdges(edges => {
      return edges.map(edge => {
        return edge;
      })
    })
  }

  useEffect(() => {
    objectsUpdate.forEach(obj => updateObject(obj));
    // edges.forEach(edge => updateEdge(edge))
  }, [objectsUpdate, edges])

  

  const updateObject = (graphObject) => {
    setGraphObjects(graphObjects => {
      return graphObjects.map(obj => {
        if (obj?.id === graphObject?.GetId()) {
          const objType = obj.type;
          if (objType === 'compartmentNode') {
            obj.data = {
              ...obj.data,
              population: graphObject.GetPopulation(),
              name: graphObject.GetName(),
              position: graphObject.GetPosition()
            };
            return obj;
          } else {
            obj.data = { ...obj.data } // something for flow
            return obj;
          }
        }
        return obj;
      });
    }, []);
  };

  const applyNodesChanges2Egraph = useCallback((changes, nds) => {
    changes.forEach((change) => {
      if (change?.type === 'position') {
        const posAbsolute = change.positionAbsolute;
        if (posAbsolute) {
          const node = nds.filter((node, _) => { return node.id === change.id })[0]
          node.data.obj.UpdatePosition(posAbsolute)
        }
      }
    })
  })



  const onNodesChange = useCallback(
    (changes) => setGraphObjects(
      (nds) => {
        applyNodesChanges2Egraph(changes, nds);
        return applyNodeChanges(changes, nds);
      }),
    [],
  )

  const runModel = async () => {
    for (let i = 0; i < 1; i++) {
      await delay(500);
      e_graph.onCompute(e_graph.GetStarted());
      updateNodesByObjects(e_graph.GetComps());
    }
  }






  const chooseExistFile = useCallback((blobText) => {
    e_graph = new EGraph(null, blobText);
    const init_nodes = getInitialNodes(e_graph);
    setGraphObjects(init_nodes);
    const init_edges = getInitialEdges(e_graph, init_nodes);
    setEdges(init_edges)
    setIsModalOpen(false);
  }, [setGraphObjects, setEdges, setIsModalOpen])

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
          setActiveTab={setActiveTab}
          setActiveTabWithReset={setActiveTabWithReset}  // добавлено
          setDevView={setDevView} devView={devView}
          viewportState={viewportState}
          setViewportState={updateViewportState}
          onCreateNew={() => { onCreateClick(false) }}
        />
        {(devView) && <NodeInspector />}
        {isAddingModalOpen && <AddingModal isOpen={isAddingModalOpen} addingNode={addingNode} createGraphNode={setGraphNodesShare} closeModal={onCloseAddingModal} />}

        <div className='reactflow_plane'>
          {adding_props && <SideBarAdding />}
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            {isChooseFileNameModalOpen && <NameAndTemplateModal isOpen={isChooseFileNameModalOpen} onCreate={createNewFile} onCancel={() => { onCreateClick(true); }} />}
            {isModalOpen && <OpenModal isOpen={isModalOpen} storageType={storagePlace} onChangeStorage={() => { setStorageViewShare(true) }} onCreate={() => { onCreateClick(false); }} handleOpenExisting={() => { openFile(chooseExistFile) }} />}
            {isStorageView && <ChooseStorageModal isOpen={isStorageView} setStorageType={setStoragePlaceShare} />}
            {isMetaDataModalOpen && <MetaDataModal is_open={isMetaDataModalOpen} storage_type={storagePlace} on_create={createOrSkipMetdata} on_skip={createOrSkipMetdata} />}
            <div className="tab-buttons">
              {showModelBtn && <button className={activeTab === 'flow' ? 'active' : ''} onClick={() => setActiveTabWithReset('flow')}>Модель</button>}
              {showImageBtn && <button className={activeTab === 'image' ? 'active' : ''} onClick={() => setActiveTabWithReset('image')}>Изображение</button>}
              {showResultsBtn && <button className={activeTab === 'results' ? 'active' : ''} onClick={() => setActiveTabWithReset('results')}>Результаты</button>}
            </div>

            {activeTab === 'flow' && (
              <FlowTab
                e_graph={e_graph}
                nodeTypes={nodeTypes}
                nodes={graphObjects}
                edges={edges}
                onNodesChange={onNodesChange}
                setEditableProps={updateEditableProps}
                setAddingNode={setAddingNodeShare}
                updateNodesByObjects={updateNodesByObjects}
                viewportState={viewportState}
                setViewportState={setViewportSettings}
                viewportSettings={viewportSettings}
                setViewportSettings={setViewportSettings}
                setEdges={setEdges}
                setGraphObjects={setGraphObjects}
              />)}
            {activeTab === 'image' && (
              <SvgTab e_graph={e_graph} />)}
            {activeTab === 'results' && (
              <ResultsTab e_graph={e_graph} />)}
          </div>
          {editableProps && <SideBarEditable {...editableProps} setStateMenu={updateEditableProps} e_graph={e_graph} updateGraphNodes={updateNodesByObjects} setGraphNodes={setGraphObjects} />}
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;