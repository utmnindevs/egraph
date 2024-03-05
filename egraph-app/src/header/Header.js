
import React from 'react';
import UpperMenu from './UpperMenu';
import LowerMenu from './LowerMenu';

const Header = ({rfInstance}) => {
  return (
    <header>
      <UpperMenu rfInstance = {rfInstance}/>
      <LowerMenu />
    </header>
  );
};

export default Header;
