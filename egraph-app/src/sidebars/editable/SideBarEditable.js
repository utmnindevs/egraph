import React, { useCallback, useEffect, useMemo, useState } from 'react';

import "./style/SideBarEditable.css"


/**
 * Создает правую панель редактирования, в соответствии с выбранным узлом.
 * Учитывает тип узла и генерирует для него определенные параметры для редактирования.
 * TODO: как идея это рендеры для компартмента и потока сделать в другом месте, разделив на файлы, а тут именно как выбор.
 * @param {{Node, function, EGraph, function, function}} param0 - Выбранный узел, функция состояния правой панели, объект графа, 
 * метод обновления узлов через граф и метод обновления узлов через хранилище узлов Reactflow
 * @returns 
 */
function SideBarEditable({ node, setStateMenu, e_graph, updateGraphNodes, setGraphNodes, ...editable_props }) {
    // После переклика несколько раз выделяется onclick на узел, что и скорее всего приводит к неточности
    // console.log(node)
    // Значения и обновления данных самого узла
    const [nodeData, setNodeData] = useState(node.data);
    const [nodeName, setNodeName] = useState(node.data.name)
    const [nodePopulation, setNodePopulation] = useState(node.data.population)
    const [nodeIns, setNodeIns] = useState(node.data.ins);
    const [nodeOuts, setNodeOuts] = useState(node.data.outs);

    // ---------------- ПОРТЫ

    // Значения и обновления состояние кнопок под входные и выходные порты
    const [isMinusInAvaliable, setMinusInAvaliable] = useState(node.data.ins != 0);
    const [isMinusOutAvaliable, setMinusOutAvaliable] = useState(node.data.outs != 0);

    /**
     * Метод увеличения/уменьшения значения входных хендлеров с проверкой на валидность кол-ва
     * @param {number} count - кол-во на которое изменяется
     */
    const updateIns = useCallback((count) => {
        if (nodeIns + count <= 0) { setNodeIns(nodeIns + count); setMinusInAvaliable(false); return; }
        setMinusInAvaliable(true);
        setNodeIns(nodeIns + count);
    }, [nodeIns, setNodeIns])

    /**
     * Метод увеличения/уменьшения значения выходных хендлеров с проверкой на валидность кол-ва
     * @param {number} count - кол-во на которое изменяется
     */
    const updateOuts = useCallback((count) => {
        if (nodeOuts + count <= 0) { setNodeOuts(nodeOuts + count); setMinusOutAvaliable(false); return; }
        setMinusOutAvaliable(true);
        setNodeOuts(nodeOuts + count);
    }, [nodeOuts, setNodeOuts])

    // ---------------- ПОРТЫ


    /**
     * Метод вызывается во время нажатия на кнопку "Принять". Обновляет текущий выбранный узел согласно обновленным данных узлов
     * через стейты
     */
    const onButtonClick = useCallback(() => {

        setGraphNodes((nds) => {
            return nds.map((nd) => {
                if (nd.id === node.id) {
                    e_graph.getCompartmentByName(nodeData.name).UpdateCompartment(nodeName, parseFloat(nodePopulation))
                    nd.data = { ...node.data, ins: nodeIns, outs: nodeOuts }
                    // TODO: проверка на существование подключенных узлов, если есть, то не менять и крикнуть пользователя
                    // иначе менять, т.к. появляется баг, что при удалении ребро остается, и после очередного добавления в него можно снова присоеденить
                }
                return nd;
            })
        })
        updateGraphNodes(e_graph.GetComps())


        setStateMenu(null);
    }, [nodeIns, nodeOuts, nodeData, nodeName, nodePopulation, updateGraphNodes])

    return (
        <div class="side-bar-editable-body">
            <p class="header"> Редактирование {node.type === 'compartmentNode' ? "компартмента" : "потока"} </p>
            <div class="content">
                <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Название</span>
                    <input type="text" max="20" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                        defaultValue={nodeName}
                        onChange={(event) => setNodeName(event.target.value)} />
                </div>
                <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Популяция</span>
                    <input type="number" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                        defaultValue={nodePopulation}
                        onChange={(event) => setNodePopulation(event.target.value)} />
                </div>
                <div class="form-check"> {/* где проверка то на булево? */}
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                    <label class="form-check-label" for="flexCheckDefault">
                        Стартовый компартмент
                    </label>
                </div>
                <div class="count ins">
                    <span>Входные порты: {nodeIns} </span>
                    <div>
                        {isMinusInAvaliable && <button class='button-inout' onClick={() => { updateIns(-1) }}>-</button>}
                        <button class='button-inout' onClick={() => { updateIns(1) }}>+</button>
                    </div>
                </div>
                <div class="count outs">
                    <span>Выходные порты: {nodeOuts} </span>
                    <div>
                        {isMinusOutAvaliable && <button class='button-inout' onClick={() => { updateOuts(-1) }}>-</button>}
                        <button class='button-inout' onClick={() => { updateOuts(1) }}>+</button>
                    </div>
                </div>
            </div>
            <button class='button-39 footer foot-button' onClick={onButtonClick}>Принять</button> {/* Добавить кейкап на enter */}
        </div>
    )
}

export default SideBarEditable;