import React, { useState, useEffect } from 'react';
import './style_modal/OpenModal.css';

import Modal from './Modal';

function OpenModal({ isOpen, onClose, handleOpenExisting }) {
  const [fileName, setFileName] = useState('');
  const [autoSave, setAutoSave] = useState(false);
  const [filePath, setFilePath] = useState('');

  useEffect(() => {
    const lastFileName = localStorage.getItem('lastFileName');
    if (lastFileName) {
      setFileName(lastFileName);
    }
    const lastFilePath = localStorage.getItem('lastFilePath');
    if (lastFilePath) {
      setFilePath(lastFilePath);
    }
    const autoSaveEnabled = localStorage.getItem('autoSave') === 'true';
    setAutoSave(autoSaveEnabled);
  }, []);

  const handleCreateNew = () => {

  };





  return (
    <>
     <Modal isOpen={isOpen} typeModal={"info"} content={
      { header_text: "Открытие файла",
        body_text: "Хотите создать новый файл проекта или открыть существующий?",
        buttons_funcs_label: [
          ["Создать новый файл", onClose],
          ["Открыть существующий файл", handleOpenExisting]
        ]
      }
      }/>
    </>
  );
}

export default OpenModal;
