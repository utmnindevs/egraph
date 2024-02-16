import React, { useState, useEffect } from 'react';
import './Modal.css'; 

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
  
  };
  

  const handleOpenExisting = () => {
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.xml'; 
  
    
    input.addEventListener('change', event => {
      const file = event.target.files[0]; 
  
      
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith('.json') || fileName.endsWith('.xml')) {
        
        console.log('Выбранный файл:', file);
        onClose(); 
      } else {
        alert('Пожалуйста, выберите файл с расширением .json или .xml');
      }
  
      
    });
  
    input.click();
  };
  

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <p>Хотите создать новый файл проекта или открыть существующий?</p>
        <button onClick={onClose}>Создать новый файл</button>
        <button onClick={handleOpenExisting}>Открыть существующий файл</button>
      </div>
    </div>
  );
}

export default Modal;
