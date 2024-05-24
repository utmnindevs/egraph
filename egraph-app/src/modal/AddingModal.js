import React, { useState, useEffect, useCallback } from 'react';
import Modal from './Modal';
import { useForm } from "react-hook-form";


const Validators = {
    name: {
        value: /^[A-ZА-Я][a-zа-яА-ЯA-Z]{3,19}$/gm,
        message: "С большой буквы, от 4х до 20ти символов"
    },
    population: {
        value: /^[0-9]*$/gm,
        message: "Только положительные"
    },
    ins:{
        value: /^^[0-9]?$/gm,
        message: "Максимум 9 портов, минимум 0"
    },
    outs:{
        value: /^^[0-9]?$/gm,
        message: "Максимум 9 портов, минимум 0"
    }
}

function ErrorMessage({errors, type}){
    console.log(errors, type)
    return(
        <span style={{fontSize:'10px', color:"red"}}> </span>
    )
}

/**
 * Форма модального окна, в котором можно задавать значения для создания новых узлов
 * P.s. Сделан не очень, но работает.
 * nextTODO: Ограничить кол-во портов до [0;10] прямо в input. Описать ограничения на все входные группы, и если
 * что-то не проходит то высвечивать нотификацию 
 * TODO: Поставить ограничения на все input соответственно
 * @param {*} param0 
 * @returns 
 */
function AddingModal({ isOpen, addingNode, createGraphNode, closeModal }) {

    let [nodeName, setNodeName] = useState(null);
    let [nodePopulation, setNodePopulation] = useState(null);
    let [nodeIns, setNodeIns] = useState(null);
    let [nodeOuts, setNodeOuts] = useState(null);


    const createGraphNodeShare = useCallback(() => {
        addingNode.data.obj.name_ = nodeName ? nodeName : "empty";
        addingNode.data.obj.population_ = nodePopulation ? nodePopulation : 0;
        addingNode.data.ins = nodeIns && nodeIns >= 0 ? nodeIns : 0;
        addingNode.data.outs = nodeOuts && nodeOuts >= 0 ? nodeOuts : 0;
        createGraphNode();
    }, [createGraphNode, addingNode])

    const { register, handleSubmit, formState  } = useForm({
        mode: "onChange"
      });



    const onSubmit = (d) => {
        if(d.some == 12){
            createGraphNodeShare();
        }
    };

    // вряд-ли правильно делаю, что присваиваю и объявляю как let

    // нужно как-то обновлять стейтмент errors чтобы получать их, иначе никак не отображать в первый раз
    const renderBodyInputs = useCallback(() => {
        return (
            <>
                <ErrorMessage errors={formState.errors} type={'name'}/>

                <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Название</span>
                    <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                         onChange={(event) => nodeName = event.target.value} 
                        required {...register("name", {
                            required: true,
                            pattern: {
                              value: /^[A-ZА-Я][a-zа-яА-ЯA-Z]{3,19}$/gm,
                              message: "С большой буквы, от 4х до 20ти символов"
                            }
                          })}/>
                          
                </div>
                <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Популяция</span>
                    <input type="number" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                        onChange={(event) => nodePopulation = event.target.value}
                        {...register("test", {
                            required: true
                        })}
                        />
                </div>
                <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Кол-во входных</span>
                    <input type="number" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                        onChange={(event) => nodeIns = event.target.value} />
                </div>
                <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Кол-во выходных</span>
                    <input  type="number" max="10" min="0" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                        onChange={(event) => nodeOuts = event.target.value} />
                </div>
            </>
        )

    }, [setNodeName]);

    

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