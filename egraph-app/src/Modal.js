import React, { useState, useEffect } from 'react';
import './Modal.css'; 

function Modal({ isOpen, onClose, handleOpenExisting }) {
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
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <p>Хотите создать новый файл проекта или открыть существующий?</p>
        <button class="modal-button" onClick={onClose}>Создать новый файл</button>
        <button class="modal-button" onClick={handleOpenExisting}>Открыть существующий файл</button>
      </div>
    </div>
  );
}

export default Modal;
