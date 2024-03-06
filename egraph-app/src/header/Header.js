
import React from 'react';
import UpperMenu from './UpperMenu';
import LowerMenu from './LowerMenu';

const Header = ({rfInstance, onDownloadFile, onRunModel}) => {
  return (
    <header>
      <UpperMenu rfInstance = {rfInstance} 
                  onDownloadFile = {onDownloadFile}
                  onRunModel = {onRunModel}/>
      <LowerMenu />
    </header>
  );
};

export default Header;
