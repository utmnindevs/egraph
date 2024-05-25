import React, { useState, useEffect, useCallback } from 'react';
import Modal from './Modal';
import { useForm, Controller } from "react-hook-form";


const Validators = {
    text: {
        pattern: {
            value: /^[A-ZА-Я][a-zа-яА-ЯA-Z]{3,19}$/,
            message: "С большой буквы, от 4х до 20ти букв"
        },
    },
    number: {
        pattern: {
            value: /^[0-9]*$/gm,
            message: "Только положительные"
        }
    }
}

function ErrorMessage({ errors, type }) {
    return (
        <span style={{ fontSize: '10px', color: "red" }}>{errors[type]?.message}</span>
    )
}

const Input = ({ type, inputType, span, errors, register }) => {
    return (
        <>
            <ErrorMessage errors={errors} type={type} />
            <div class="input-group input-group-sm mb-3">
                <span class="input-group-text" id="inputGroup-sizing-sm">{span}</span>
                <input type={inputType} class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                    {...register} required
                />
            </div>
        </>
    )
}

/**
 * Форма модального окна, в котором можно задавать значения для создания новых узлов
 * P.s. Сделан не очень, но работает.
 * nextTODO: Ограничить кол-во портов до [0;10] прямо в input. Описать ограничения на все входные группы, и если
 * что-то не проходит то высвечивать нотификацию 
 * @param {*} param0 
 * @returns 
 */
function AddingModal({ isOpen, addingNode, createGraphNode, closeModal }) {
    const { register, handleSubmit, setError, formState: { errors } } = useForm({
        mode: 'onSubmit', defaultValues: {
            name: ""
        }
    });


    const onSubmit = useCallback((form_data) => {
        addingNode.data.obj.name_ = form_data.name;
        addingNode.data.obj.population_ = parseInt(form_data.population);
        addingNode.data.ins = parseInt(form_data.ins);
        addingNode.data.outs = parseInt(form_data.outs);
        createGraphNode()
    }, [createGraphNode]);

    const renderBodyInputs = () => {
        return (
            <>
                <Input type={'name'} inputType={'text'} span={'Название'} errors={errors} register={register('name', {
                    required: true,
                    pattern: Validators.text.pattern
                })} />

                <Input type={'population'} inputType={'number'} span={'Популяция'} errors={errors} register={register('population', {
                    required: true,
                    pattern: Validators.number.pattern
                })} />

                <Input type={'ins'} inputType={'number'} span={'Кол-во входных'} errors={errors} register={register('ins', {
                    required: true,
                    pattern: Validators.number.pattern
                })} />

                <Input type={'outs'} inputType={'number'} span={'Кол-во выходных'} errors={errors} register={register('outs', {
                    required: true,
                    pattern: Validators.number.pattern
                })} />
            </>
        )
    };

    return (
        <Modal isOpen={isOpen} typeModal={"another"}
            content={{
                header_text: "Добавление нового узла",
                body_text: renderBodyInputs,
                buttons_funcs_label: [
                    ['Создать', handleSubmit(onSubmit)],
                    ['Отмена', closeModal]
                ]
            }} handleSubmit={handleSubmit(onSubmit)} />
    )

}

export default AddingModal;