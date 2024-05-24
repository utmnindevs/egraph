import React, { useState, useEffect } from 'react';

import "./style_modal/Modal.css";

import IconRender from './IconRender';

/**
 * Шаблон модального окна, принимающий в себя параметры - Открыто ли окно, тип модального окна {"warning", "info", "another"} 
 * и контент модального окна содержащий следующее: { header_text: "", body_text: "", buttons_funcs_label: [ [label, function], ... ] }
 * TODO: Сделать body_text проверку на функцию, для того чтобы можно было передавать внутрь функцию для мб создания ещё каких-то выборов -> поможет в создании
 * компартмента
 * @returns 
 */
function Modal({isOpen, typeModal, content}) {    
    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="content">
                <div className="header">
                    <IconRender icon_type={typeModal}/>
                    <span>{content.header_text}</span>
                </div>
                <div className="body">
                    <p>{content.body_text}</p>
                </div>
                <div className="buttons">
                    {Array.from({length: content.buttons_funcs_label.length}, (_, index) => {
                        return <button class="modal-button" onClick={content.buttons_funcs_label[index][1]}> {content.buttons_funcs_label[index][0]} </button>
                    })}
                </div>
            </div>

        </div>
    )

}


export default Modal;