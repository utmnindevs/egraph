import React, { useState, useEffect, useCallback } from 'react';
import Modal from './Modal';


/**
 * Форма модального окна, в котором можно задавать значения для создания новых узлов
 * P.s. Сделан не очень, но работает.
 * TODO: Ограничить кол-во портов до [0;10] прямо в input
 * TODO: Поставить ограничения на все input соответственно
 * @param {*} param0 
 * @returns 
 */
function AddingModal({ isOpen, addingNode, createGraphNode, closeModal }) {

    let [nodeName, setNodeName] = useState(null);
    let [nodePopulation, setNodePopulation] = useState(null);
    let [nodeIns, setNodeIns] = useState(null);
    let [nodeOuts, setNodeOuts] = useState(null);

    // вряд-ли правильно делаю, что присваиваю и объявляю как let
    const renderBodyInputs = useCallback(() => {
        return (
            <>
                <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Название</span>
                    <input type="text" max="20" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                        onChange={(event) => nodeName = event.target.value} />
                </div>
                <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Популяция</span>
                    <input type="number" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                        onChange={(event) => nodePopulation = event.target.value} />
                </div>
                <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Кол-во входных</span>
                    <input type="number" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                        onChange={(event) => nodeIns = event.target.value} />
                </div>
                <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Кол-во выходных</span>
                    <input type="number" max="10" min="0" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                        onChange={(event) => nodeOuts = event.target.value} />
                </div>
            </>
        )

    }, [setNodeName]);

    const createGraphNodeShare = useCallback(() => {
        addingNode.data.obj.name_ = nodeName ? nodeName : "empty";
        addingNode.data.obj.population_ = nodePopulation ? nodePopulation : 0;
        addingNode.data.ins = nodeIns && nodeIns >= 0 ? nodeIns : 0;
        addingNode.data.outs = nodeOuts && nodeOuts >= 0? nodeOuts : 0;
        createGraphNode();
    }, [createGraphNode, addingNode])

    return (<Modal isOpen={isOpen} typeModal={"info"}
        content={{
            header_text: "Добавление нового узла",
            body_text: renderBodyInputs,
            buttons_funcs_label: [
                ['Создать', createGraphNodeShare],
                ['Отмена', closeModal]
            ]
        }} />)

}

export default AddingModal;