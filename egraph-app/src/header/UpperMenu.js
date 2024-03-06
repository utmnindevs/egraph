

import React, { useState, useRef, useCallback } from 'react';
import './UpperMenu.css';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

 

import 'bootstrap/dist/css/bootstrap.min.css'
import { Button } from 'react-bootstrap';

const UpperMenu = ({ rfInstance }) => {
  const [fileName, setFileName] = useState("Untitled");

  const handleFileNameChange = (event) => {
    setFileName(event.target.innerText);
  };

  const onDownloadJson = useCallback(() => {
    const saveStateAndDownload = async () => {
      if (rfInstance) {
        localStorage.setItem("nodes", JSON.stringify(rfInstance.getNodes()));

        console.log(localStorage.getItem("nodes"));

        fetch('http://127.0.0.1:8000/api/convertToJson', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: localStorage.getItem("nodes"),
        }).then(res => res.json()).then(response => {
          console.log(response)
          const element = document.createElement("a"); 
          const textFile = new Blob(["{\"Compartments\": [" + JSON.stringify(response) + "]}"], { type: 'application/json' }); //так плохо делать, но пока костыльно 
          element.href = URL.createObjectURL(textFile); 
          element.download = document.getElementById("title_filename").innerHTML + ".json"; 
          document.body.appendChild(element); 
          element.click(); 
        })
        .catch(error => console.error('Error: ', error));
      }
    };

    saveStateAndDownload();

  })

  

  function FileMenuDropDown(params) {
    return (
      <Dropdown>
      <Dropdown.Toggle as={CustomToggle}  id="dropdown-custom-components">
        {params.name}
      </Dropdown.Toggle>
  
      <Dropdown.Menu>
        <Dropdown.Item>Открыть</Dropdown.Item>
        <Dropdown.Item >Сохранить</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    );
  }

  function AboutMenuDropDown(params) {
    return (
      <Dropdown>
      <Dropdown.Toggle as={CustomToggle}  id="dropdown-custom-components">
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
      <Dropdown.Toggle as={CustomToggle}  id="dropdown-custom-components">
        {params.name}
      </Dropdown.Toggle>
  
      <Dropdown.Menu>
        <Dropdown.Item>Лос пенгвинос маласе ласкаре</Dropdown.Item>
  
      </Dropdown.Menu>
    </Dropdown>
    );
  }
  
  function StartModelDropDown(params) {
    return (
      <Dropdown>
      <Dropdown.Toggle as={CustomToggle}  id="dropdown-custom-components">
        {params.name}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item>Запустить</Dropdown.Item>
  
      </Dropdown.Menu>
    </Dropdown>
    );
  }

  return (
    <div className="upper-menu">
      <div className="logo-and-file">
        <img src="logo.svg" alt="Logo" />
        <h1 id='title_filename'
          contentEditable
          onBlur={handleFileNameChange}
          suppressContentEditableWarning={true}
        >
          {fileName}
        </h1>
      </div>
      <div className="header-buttons" >

        <FileMenuDropDown className="hdr-button" name={'Файл'}/>
        <EditMenuDropDown className="hdr-button" name={'Правка'}/>
        <AboutMenuDropDown className="hdr-button" name={'Справка'}/>
        <StartModelDropDown className="hdr-button" name= {'Модель'}/>
        <></>
      </div>
    </div >
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
