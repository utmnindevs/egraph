
import React, { useCallback } from 'react';
import ReactFlow, { useStore } from 'reactflow';

import './style_header/LowerMenu.css';

const fill_color = "#E9F2FF"

const selector = (state) => {
  return {
    unselectAll: state.unselectNodesAndEdges
  };
};


function LowerMenu({ viewportState, setViewportState, setDevView, devView, onRunModel }) {

  const { unselectAll } = useStore(selector);


  const onButtonClick = useCallback((new_state) => {
    setViewportState(new_state)
    if (new_state === 'view') { unselectAll() };
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
        <div style={{color: fill_color}}>|</div>
        <button className='button-icon' onClick={() => setDevView(!devView)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={devView ? fill_color : "black"} class="bi bi-file-earmark-code" viewBox="0 0 16 16">
          <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6.646 7.646a.5.5 0 1 1 .708.708L5.707 10l1.647 1.646a.5.5 0 0 1-.708.708l-2-2a.5.5 0 0 1 0-.708zm2.708 0 2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L10.293 10 8.646 8.354a.5.5 0 1 1 .708-.708"/>
          </svg>
        </button>
        <div style={{color: fill_color}}>|</div>
        <button className='button-icon' onClick={() => {onRunModel()}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
</svg>
        </button>
      </div>

    </div>
  );
};

export default LowerMenu;
