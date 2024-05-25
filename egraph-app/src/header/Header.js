import React from 'react';
import UpperMenu from './UpperMenu';
import LowerMenu from './LowerMenu';

const Header = ({ 
  rfInstance, 
  onDownloadFile, 
  onRunModel, 
  handleOpenExisting, 
  handleShowResults,
  handleShowImage, 
  handleShowModel, 
  viewportState, 
  setViewportState,
  setActiveTab,
  setDevView,
  devView  }) => {
  
    return (
    <header>
      <UpperMenu
        rfInstance={rfInstance}
        onDownloadFile={onDownloadFile}
        onRunModel={onRunModel}
        handleOpenExisting={handleOpenExisting}
        handleShowResults={handleShowResults} 
        handleShowImage={handleShowImage}
        handleShowModel={handleShowModel}
        setActiveTab = {setActiveTab}
      />
      <LowerMenu 
      viewportState={viewportState} setViewportState={setViewportState}
      setDevView={setDevView} devView={devView}
      />
    </header>
  );
};

export default Header;
