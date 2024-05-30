import React from 'react';
import UpperMenu from './UpperMenu';
import LowerMenu from './LowerMenu';


const Header = ({ 
  e_graph,
  onRunModel, 
  onChooseFile,
  handleShowResults,
  handleShowImage, 
  handleShowModel, 
  viewportState, 
  setViewportState,
  setActiveTab,
  setDevView,
  devView,
  onCreateNew  }) => {    
  
    return (
    <header>
      <UpperMenu
        e_graph={e_graph}
        onRunModel={onRunModel}
        onChooseFile={onChooseFile}
        handleShowResults={handleShowResults} 
        handleShowImage={handleShowImage}
        handleShowModel={handleShowModel}
        setActiveTab = {setActiveTab}
        onCreateNew={onCreateNew}
      />
      <LowerMenu 
      viewportState={viewportState} setViewportState={setViewportState}
      setDevView={setDevView} devView={devView} onRunModel={onRunModel}
      />
    </header>
  );
};

export default Header;
