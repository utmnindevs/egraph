import React, { useState, useEffect } from 'react';

import "./style_modal/Modal.css";

import IconRender from './IconRender';

/**
 * Шаблон модального окна, принимающий в себя параметры - Открыто ли окно, тип модального окна {"warning", "info", "another"} 
 * и контент модального окна содержащий следующее: { header_text: "", body_text: "", buttons_funcs_label: [ [label, function], ... ] }
 * @returns 
 */
function Modal({ isOpen, typeModal, content, handleSubmit }) {

    const renderBody = () => {
        if (typeof (content.body_text) === 'string') {
            return (<> {content.body_text} </>)
        }

        if (typeof (content.body_text) === 'function') {
            return (<>{content.body_text()}</>)
        }
    }
    return (

        <div className={`modal ${isOpen ? 'open' : ''}`}>

            <div className="content">
                <div className="header">
                    <IconRender icon_type={typeModal} />
                    <span>{content.header_text}</span>
                </div>
                <form >
                    <div className="body">
                        <p>{renderBody()}</p>
                    </div>
                    <div className="buttons">
                        {Array.from({ length: content.buttons_funcs_label.length }, (_, index) => {
                            return <button class="modal-button" onClick={content.buttons_funcs_label[index][1]}> {content.buttons_funcs_label[index][0]} </button>
                        })}
                    </div>
                </form>
            </div>

        </div>

    )

}


export default Modal;