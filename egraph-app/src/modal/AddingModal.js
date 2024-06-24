import React, { useState, useEffect, useCallback } from 'react';
import Modal from './Modal';
import { useForm, Controller } from "react-hook-form";

import { AddingFormInputs } from '../handlers/CompartmentForms';
import { AddingFormInputsFlow } from '../handlers/FlowForms';

/**
 * Форма модального окна, в котором можно задавать значения для создания новых узлов
 * @param {*} param0 
 * @returns 
 */
function AddingModal({ isOpen, addingNode, createGraphNode, closeModal }) {
    const { register, handleSubmit, setError, formState: { errors } } = useForm({mode: 'onSubmit'});

    const node_type = addingNode.type;

    const ChooseBodyGenerate = () => {
        switch(node_type){
            case "flowNode":
                return AddingFormInputsFlow;
            case "compartmentNode":
                return AddingFormInputs;
            default:
                throw "Not exist type of node";
        }
    }

    const onSubmit = useCallback((form_data) => {
        switch(node_type){
            case "flowNode":
                addingNode.data.obj.coef_name_ = form_data.coef_name;
                addingNode.data.obj.coef_ = parseFloat(form_data.coef)
            case "compartmentNode":
                addingNode.data.obj.name_ = form_data.name;
                addingNode.data.obj.population_ = parseInt(form_data.population);
                break;
            default:
                throw "Not exist type of node";
        }
        
        createGraphNode()
    }, [createGraphNode]);

    return (
        <Modal isOpen={isOpen} typeModal={"another"}
            content={{
                header_text: "Добавление нового узла",
                body_text: ChooseBodyGenerate()({errors: errors, register: register}),
                buttons_funcs_label: [
                    ['Создать', handleSubmit(onSubmit)],
                    ['Отмена', closeModal]
                ]
            }} handleSubmit={handleSubmit(onSubmit)} />
    )

}

export default AddingModal;