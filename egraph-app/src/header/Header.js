
import React from 'react';
import UpperMenu from './UpperMenu';
import LowerMenu from './LowerMenu';

const Header = ({ rfInstance, onDownloadFile, onRunModel, handleOpenExisting }) => {
  return (
    <header>
      <UpperMenu rfInstance={rfInstance}
        onDownloadFile={onDownloadFile}
        onRunModel={onRunModel}
        handleOpenExisting={handleOpenExisting} />
      <LowerMenu />
    </header>
  );
};

export default Header;
