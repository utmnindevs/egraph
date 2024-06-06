import React from 'react';
import './style_modal/Modal.css';
import IconRender from './IconRender';

/**
 * Шаблон модального окна, принимающий в себя параметры - Открыто ли окно, тип модального окна {"warning", "info", "another"}
 * и контент модального окна содержащий следующее: { header_text: "", body_text: "", buttons_funcs_label: [ [label, function], ... ] }
 * @returns 
 */
function Modal({ isOpen, typeModal, content, isFormed, modalClass }) {

    const renderBody = () => {
        if (typeof (content.body_text) === 'string' || 'object') {
            return (<> {content.body_text} </>)
        }

        if (typeof (content.body_text) === 'function') {
            return (<>{content.body_text()}</>)
        }
    }
    const renderBodyButtons = () => {
        return (
            <>
                <div className="body">
                    <p>{renderBody()}</p>
                </div>
                <div className="buttons">
                    {Array.from({ length: content.buttons_funcs_label.length }, (_, index) => {
                        return <button class="modal-button" onClick={content.buttons_funcs_label[index][1]}> {content.buttons_funcs_label[index][0]} </button>
                    })}
                </div>
            </>
        )
    }
    const renderBodyForm = () => {
        if (isFormed === undefined) {
            return (
                <><form className="modal_form">
                    {renderBodyButtons()}
                </form>
                </>
            )
        }
        else {
            return (
                <>{renderBodyButtons()}</>
            )
        }
    }
    return (

        <div className={`modal ${isOpen ? 'open' : ''} ${typeModal} ${modalClass}`}>

            <div className="content">
                <div className="header">
                    <IconRender icon_type={typeModal} />
                    <span>{content.header_text}</span>
                </div>
                {renderBodyForm()}
            </div>

        </div>

    )

}

export default Modal;
