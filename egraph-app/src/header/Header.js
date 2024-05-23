import React from 'react';
import UpperMenu from './UpperMenu';
import LowerMenu from './LowerMenu';

const Header = ({ rfInstance, onDownloadFile, onRunModel, handleOpenExisting, handleShowResults,handleShowImage, handleShowModel, viewportState, setViewportState }) => {
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
      />
      <LowerMenu 
      viewportState={viewportState} setViewportState={setViewportState}
      />
    </header>
  );
};

export default Header;
