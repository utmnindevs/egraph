import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from "react-hook-form";

import "./style/SideBarEditable.css"

import { EditableFormInputs } from '../../handlers/CompartmentForms';

/**
 * Создает правую панель редактирования, в соответствии с выбранным узлом.
 * Учитывает тип узла и генерирует для него определенные параметры для редактирования.
 * @param {{Node, function, EGraph, function, function}} param0 - Выбранный узел, функция состояния правой панели, объект графа, 
 * метод обновления узлов через граф и метод обновления узлов через хранилище узлов Reactflow
 * @returns 
 */
function SideBarEditable({ node, setStateMenu, e_graph, updateGraphNodes, setGraphNodes, ...editable_props }) {
    const { register, handleSubmit, setError, formState: { errors }, reset } = useForm({mode: 'onSubmit', defaultValues: {
        name: node.data.name,
        population: node.data.population,
        ins: node.data.ins,
        outs: node.data.outs
    }});

    useEffect(() => {
        reset({
            name: node.data.name,
            population: node.data.population,
            ins: node.data.ins,
            outs: node.data.outs
        });
    }, [node, reset]);

    /**
     * Метод вызывается во время нажатия на кнопку "Принять". Обновляет текущий выбранный узел согласно обновленным данным узлов
     * через стейты
     */
    const onCompleteSubmit = useCallback((data) => {
        setGraphNodes((nds) => {
            return nds.map((nd) => {
                if (nd.id === node.id) {
                    e_graph.getCompartmentByName(node.data.name).UpdateCompartment(data.name, parseFloat(data.population))
                    nd.data = { ...node.data, ins: parseInt(data.ins), outs: parseInt(data.outs) }
                }
                return nd;
            })
        })
        updateGraphNodes(e_graph.GetComps())
        setStateMenu(null);
    }, [updateGraphNodes, node, setGraphNodes, e_graph, setStateMenu]);

    const onSubmit = useCallback((form_data) => {
        onCompleteSubmit(form_data);
    }, [onCompleteSubmit]);

    return (
        <div class="side-bar-editable-body">
            <p class="header"> Редактирование {node.type === 'compartmentNode' ? "компартмента" : "потока"} </p>
            <form className='form-content'>
                <div class="content">
                    <EditableFormInputs errors={errors} register={register}/>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                        <label class="form-check-label" for="flexCheckDefault">
                            Стартовый компартмент
                        </label>
                    </div>
                </div>
                <button class='button-39 footer foot-button' onClick={handleSubmit(onSubmit)}>Принять</button>
            </form>
        </div>
    )
}

export default SideBarEditable;
