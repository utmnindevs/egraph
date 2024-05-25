import React, { useState, useEffect, useCallback } from 'react';
import Modal from './Modal';
import { useForm } from "react-hook-form";


const Validators = {
    text: {   
        pattern: {
            value: /^[A-ZА-Я][a-zа-яА-ЯA-Z]{3,19}$/gm,
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

function ErrorMessage({errors, type}){
    return(
        <span style={{fontSize:'10px', color:"red"}}>{errors[type]?.message}</span>
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
    const { register, handleSubmit, setError, formState: { errors } } = useForm({mode:'onSubmit'});


    const onSubmit = useCallback((form_data) => {
        addingNode.data.obj.name_ = form_data.name;
        addingNode.data.obj.population_ = parseInt(form_data.population);
        addingNode.data.ins = parseInt(form_data.ins);
        addingNode.data.outs = parseInt(form_data.outs);
        createGraphNode()
    }, [createGraphNode]);

    // нужно как-то обновлять стейтмент errors чтобы получать их, иначе никак не отображать в первый раз
    const renderBodyInputs = useCallback(() => {
        return (
            <>
                <ErrorMessage errors={errors} type={'name'}/>
                <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Название</span>
                    <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                        {...register("name", {
                            required: true,
                            pattern: Validators.text.pattern
                          })} required
                        />  
                </div>

                <ErrorMessage errors={errors} type={'population'}/>
                <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Популяция</span>
                    <input type="number" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                        {...register("population", {
                            required: true,
                            pattern: Validators.number.pattern
                        })} required
                        />
                </div>

                <ErrorMessage errors={errors} type={'ins'}/>
                <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Кол-во входных</span>
                    <input type="number" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                        {...register("ins", {
                            required: true,
                            pattern: Validators.number.pattern
                        })} required
                        />
                </div>

                <ErrorMessage errors={errors} type={'outs'}/>
                <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Кол-во выходных</span>
                    <input  type="number" max="10" min="0" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                        {...register("outs", {
                            required: true,
                            pattern: Validators.number.pattern
                        })} required
                        />
                </div>
            </>
        )

    }, []);

    

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