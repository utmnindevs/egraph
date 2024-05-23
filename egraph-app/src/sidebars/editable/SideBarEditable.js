import React, { useCallback, useEffect, useMemo, useState } from 'react';

import "./style/SideBarEditable.css"


/**
 * 
 * @param {{Node, function, EGraph}} param0 
 * @returns 
 */
function SideBarEditable({ node, setStateMenu, e_graph, setGraphNodes, ...editable_props }) {

    const [nodeData, setNodeData] = useState(node.data);
    const [nodeName, setNodeName] = useState(node.data.name)
    const [nodePopulation, setNodePopulation] = useState(node.data.population)

    // useEffect(() => {
    //     nodeData.obj.name_ = "testing"

    //     setGraphNodes((nds) => {
    //         return nds.map((nd) => {
    //             if(nd.id === node.id){
    //                 nd.data = {
    //                     ...nd.data,
    //                     obj: nodeData.obj
    //                 }
    //                 console.log(nd.data)
    //             }
    //             return nd;
    //         })
    //     })

    //     // setStateMenu(null);
    // }, [nodeData, setGraphNodes])

    const onButtonClick = useCallback(() => {
        e_graph.getCompartmentByName(nodeData.name).UpdateCompartment(nodeName, parseFloat(nodePopulation))
        setGraphNodes(e_graph.GetComps())

        setStateMenu(null);
    }, [nodeData, nodeName, nodePopulation, setGraphNodes])

    // TODO: решить баг с тем, что при выделении в не hover зоне то считает за клик, переклик или другие действия сразу закрывает правый сайдбар
    // TODO: добавить кнопку закрытия и режим редактирования в панели в виде кнопки, в котором есть возможность вызывать этот сайдбар

    return (
        <div class="side-bar-editable-body">
            <p class="header"> Редактирование {node.type === 'compartmentNode' ? "компартмента" : "потока"} </p>

            <div class="content">
                <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Название</span>
                    <input type="text" max="20" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                        defaultValue={node.data.name}
                        onChange={(event) => setNodeName(event.target.value)} />
                </div>
                <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Популяция</span>
                    <input type="number" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" 
                    defaultValue={node.data.obj.population_}
                    onChange={(event) => setNodePopulation(event.target.value)} />
                </div>
                <div class="form-check"> {/* где проверка то на булево? */}
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                    <label class="form-check-label" for="flexCheckDefault">
                        Стартовый компартмент
                    </label>
                </div>
                <div class="count ins">
                    <span>Входные порты: {node.data.ins} </span>
                    <div>
                        {true && <button class='button-inout'>-</button>}
                        <button class='button-inout'>+</button>
                    </div>
                </div>
                <div class="count outs">
                    <span>Выходные порты: {node.data.outs} </span>
                    <div>
                        {true && <button class='button-inout'>-</button>}
                        <button class='button-inout'>+</button>
                    </div>
                </div>
                {/* <p>Кол-во выходных</p> Сделать через кнопку "плюс" и "минус" с предупреждением что для минуса нужно отсоеденить поток  */}

            </div>


            <button class='button-39 footer foot-button' onClick={onButtonClick}>Принять</button> {/* Добавить кейкап на enter */}
        </div>
    )
}

export default SideBarEditable;