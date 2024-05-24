import React, { useState, useEffect } from 'react';
import './style_modal/OpenModal.css';

import Modal from './Modal';

function ErrorModal({ isOpen, onClose, body_text }) {

  return (
    <>
     <Modal isOpen={isOpen} typeModal={"warning"} content={
      { header_text: "Ошибка",
        body_text: body_text,
        buttons_funcs_label: [["Ок", onClose]]
      }
      }/>
    </>
  );
}

export default ErrorModal;
