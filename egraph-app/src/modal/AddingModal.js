import React, { useState, useEffect } from 'react';
import Modal from './Modal';

function AddingModal({ isOpen, createGraphNode, closeModal }) {


    return (<Modal isOpen={isOpen} typeModal={"info"}
        content={{
            header_text: "Добавление нового узла",
            body_text: "тест",
            buttons_funcs_label: [
                ['Создать', createGraphNode],
                ['Отмена', closeModal] 
            ]
        }} />)

}

export default AddingModal;