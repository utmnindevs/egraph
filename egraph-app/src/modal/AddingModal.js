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

    const onSubmit = useCallback((form_data) => {
        addingNode.data.obj.name_ = form_data.name;
        addingNode.data.obj.population_ = parseInt(form_data.population);
        addingNode.data.ins = parseInt(form_data.ins);
        addingNode.data.outs = parseInt(form_data.outs);
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