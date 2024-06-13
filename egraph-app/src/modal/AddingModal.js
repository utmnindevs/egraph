import React, { useState, useEffect, useCallback } from 'react';
import Modal from './Modal';
import { useForm, Controller } from "react-hook-form";

import { AddingFormInputs } from '../handlers/CompartmentForms';

/**
 * Форма модального окна, в котором можно задавать значения для создания новых узлов
 * @param {*} param0 
 * @returns 
 */
function AddingModal({ isOpen, addingNode, createGraphNode, closeModal }) {
    const { register, handleSubmit, setError, formState: { errors } } = useForm({mode: 'onSubmit'});

    const ConstructHandleId = (id, handle_type, node_type) => {
        return "handle_" + node_type + "_" +  handle_type + "_" + (id);
      }

    function GenerateHandlesIds(handle_type, node_type){
        return Array.from({length: 1}, (_, index) => {
            return ConstructHandleId(index, handle_type, node_type);
        })
    }

    const onSubmit = useCallback((form_data) => {
        addingNode.data.obj.name_ = form_data.name;
        addingNode.data.obj.population_ = parseInt(form_data.population);
        addingNode.data.ins = GenerateHandlesIds("target", "comp");
        addingNode.data.outs = GenerateHandlesIds("source", "comp");
        createGraphNode()
    }, [createGraphNode]);

    return (
        <Modal isOpen={isOpen} typeModal={"another"}
            content={{
                header_text: "Добавление нового узла",
                body_text: AddingFormInputs({errors: errors, register: register}),
                buttons_funcs_label: [
                    ['Создать', handleSubmit(onSubmit)],
                    ['Отмена', closeModal]
                ]
            }} handleSubmit={handleSubmit(onSubmit)} />
    )

}

export default AddingModal;