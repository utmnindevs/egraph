
import React, { useCallback } from 'react';
import ReactFlow, { useStore } from 'reactflow';

import './style_header/LowerMenu.css';

const fill_color = "#E9F2FF"

const selector = (state) => {
  return {
    unselectAll: state.unselectNodesAndEdges
  };
};


function LowerMenu({viewportState, setViewportState}){

  const { unselectAll } = useStore(selector);


  const onButtonClick = useCallback((new_state)=>{
    setViewportState(new_state)
    if(new_state === 'view'){unselectAll()};
  }, [setViewportState])

  return (
    <div className="lower-menu">
      <div className='icons-toolbar'>
        <div className='view'>
          <button className='button-icon' onClick={() => onButtonClick("view")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={viewportState === "view" ? fill_color : "black"} class="bi bi-eye-fill" viewBox="0 0 16 16">
              <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
              <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
            </svg>
          </button>
          <button className='button-icon' onClick={() => onButtonClick("edit")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={viewportState === "edit" ? fill_color : "black"} class="bi bi-pencil-fill" viewBox="0 0 16 16">
              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
            </svg>
          </button>
        </div>

      </div>

    </div>
  );
};

export default LowerMenu;
