import React, { useState, useCallback } from 'react';
import './style_header/UpperMenu.css';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';

import { onSaveFileAs, onEditCurrentFile, openFile, getRecentFile } from '../handlers/Save';


const UpperMenu = ({ onChooseFile, e_graph, onRunModel, handleShowResults, handleShowImage, handleShowModel,setActiveTab,  onCreateNew  }) => {
  const [fileName, setFileName] = useState(getRecentFile()?.name || "untitled");

  const handleFileNameChange = (event) => {
    setFileName(event.target.innerText);
  };

  function FileMenuDropDown(params) {
    return (
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
          {params.name}
        </Dropdown.Toggle>
  
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => {onCreateNew(false)}}>Создать...</Dropdown.Item>
          <Dropdown.Item onClick={() => {openFile(onChooseFile)}}>Открыть из...</Dropdown.Item>
          <Dropdown.Item onClick={() => {}}>Открыть недавнее</Dropdown.Item>
          <hr></hr>
          <Dropdown.Item onClick={() => {onEditCurrentFile(e_graph.toJson())}}>Сохранить</Dropdown.Item>
          <Dropdown.Item onClick={() => {onSaveFileAs(e_graph.toJson())}}>Сохранить как...</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  function AboutMenuDropDown(params) {
    return (
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
          {params.name}
        </Dropdown.Toggle>
  
        <Dropdown.Menu>
          <Dropdown.Item>Тут могла быть ваша реклама</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  function EditMenuDropDown(params) {
    return (
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
          {params.name}
        </Dropdown.Toggle>
  
        <Dropdown.Menu>
          <Dropdown.Item>Лос пенгвинос маласе ласкаре</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
  
  const StartModelDropDown = ({ name }) => {

    const handleShowResultsClick = () => {
      if (handleShowResults) {
        handleShowResults(true); 
        setActiveTab('results');
      }
    };

    const handleShowImageClick = () => {
      if (handleShowImage) {
        handleShowImage(true); 
        setActiveTab('image');
      }
    };

    const handleShowModelClick = () => {
      if (handleShowModel) {
        handleShowModel(true); 
        
      }
    };

    return (
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
          {name}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => { onRunModel() }}>Запустить </Dropdown.Item>
          <Dropdown.Item onClick ={() => {handleShowImageClick(); handleShowModelClick(); }}>Получить изображение</Dropdown.Item>
          <Dropdown.Item onClick ={() => {handleShowResultsClick(); handleShowModelClick();}}>Получить результаты</Dropdown.Item>
          

        </Dropdown.Menu>
      </Dropdown>
    );
  };
  
  function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }
  
  return (
    <div className="upper-menu">
      <div className="logo-and-content">
        <div className="logo">
          <img src="logo.svg" alt="Logo" />
        </div>
        <div className="content">
          <h1
            id='title_filename'
            contentEditable
            onBlur={handleFileNameChange}
            suppressContentEditableWarning={true}
          >
            {fileName}
          </h1>
          <div className="header-buttons">
            <button className="dark-mode-button" onClick={toggleDarkMode}>Dark Theme</button>
            <FileMenuDropDown className="hdr-button" name={'Файл'} />
            <EditMenuDropDown className="hdr-button" name={'Правка'} />
            <AboutMenuDropDown className="hdr-button" name={'Справка'} />
            <StartModelDropDown className="hdr-button" name={'Модель'} />
            {true && <div style={{fontSize: '10px', color: 'rgba(0,0,0,0.5)'}}> Все изменения сохранены</div>}

          </div>
        </div>
      </div>
    </div>
  );
};

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <button
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </button>
));

export default UpperMenu;
