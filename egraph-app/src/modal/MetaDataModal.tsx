import React from 'react';

import Modal from './Modal';
import "./style_modal/MetaDataForm.css"

interface ContentInput{
    desc: string,
    isArea: boolean,
    isAdded: boolean
}

interface ModalProps{
    is_open: boolean, storage_type: string, on_create: any, on_skip: any
}

export default function MetaDataModal(props: ModalProps){
    const RenderInputForm = (content: ContentInput) => {
        const DelIcon = () => {
            return (<>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                </svg>
            </>)
        }

        return(
            <>
                <div className='input-content'>
                    <div className='left'>
                        <a> {content.desc} </a>
                    </div>
                    <div className='right'>
                        {content.isArea && <textarea className="form-control" aria-label="With textarea"></textarea>}
                        {!content.isArea && <input type="text" className="form-control" aria-describedby="basic-addon1"></input>}
                        {content.isAdded && <DelIcon/>}
                    </div>
                </div>
            </>
        )
    }

    const RenderAddNew = () => {
        return(<>
        <div className='create-content'>
        <div className='left'>
            <input type="text" className="form-control" placeholder='Введите название свойства' aria-describedby="basic-addon1"></input>
        </div>
        <div className='right'>
            <button className="val-button" type="button">Добавить</button>
        </div>
        </div>
        </>)
    }
    
    const RenderBody = () => {
        return(<>
            <div className='inputs-content'>
                <RenderInputForm desc='modal_name' isArea={false} isAdded={false}/>
                <RenderInputForm desc='description' isArea={true} isAdded={false}/>
                <RenderInputForm desc='author' isArea={false} isAdded={false}/>
                <RenderInputForm desc='version' isArea={false} isAdded={true}/>
                <RenderAddNew/>
            </div>
        </>)
    }

    return (
        <>
            <Modal 
            isOpen={props.is_open} typeModal={props.storage_type} isFormed={false}
            content={{
                header_text: "Метаданные файла: ",
                body_text: RenderBody(),
                buttons_funcs_label: [
                    ["Создать", props.on_create],
                    ["Пропустить", props.on_skip]
                ]
            }}
            />
        </>
    );
}