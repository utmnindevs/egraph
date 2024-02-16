import React, { useState, useEffect } from 'react';
import './Modal.css'; // Импортируем файл со стилями

function Modal({ isOpen, onClose }) {
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
    // Здесь вы можете добавить логику создания нового файла
    onClose();
  };

  const handleOpenExisting = () => {
    // Здесь вы можете добавить логику открытия существующего файла
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <p>Хотите создать новый файл проекта или открыть существующий?</p>
        <button onClick={handleCreateNew}>Создать новый файл</button>
        <button onClick={handleOpenExisting}>Открыть существующий файл</button>
      </div>
    </div>
  );
}

export default Modal;
