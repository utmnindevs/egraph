import { useCallback, useState } from 'react';
import { Background, Handle, Position, useUpdateNodeInternals, useStore } from 'reactflow';
import React, { memo } from 'react';

import CompartmentHandle from './CompartmentHandle';
 
const selector = (s) => ({
  nodeInternals: s.nodeInternals,
  edges: s.edges,
});
 
function CompartmentNode({ data }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);



  const constructHandleId = (id, type) => {
    return "handle_comp_" + type + "_" + id + "_" + data.name.substr(0,2);
  }

  /**
   * Конструирование хенделра путем его идентификатора, типа и позиции
   * @param {{number, string, string}} param0 -  
   * @returns 
   */
  function OrientationHandler({id, type, position}){

    const st = {top: 20* id + 20}
    return(
      <>
        <CompartmentHandle id={constructHandleId(id, type)} 
        type={type} 
        position={position === "Left" ? Position.Left : Position.Right}
        style={{...st}}/>
      </>
    );
  }

 
  return (
    <div class='compartment-node container'>
      <div class="row compartment-node-header ">
        <div class="col-sm-8">
          <label htmlFor="text"> {data.name.substr(0,2).toUpperCase()}: {data.name} </label>
        </div>
        <div class="col-4 start-compartment-check">
          {/* <input class="form-check-radio nodrag" type="radio" value="" id="flexCheckDefault"></input> */}
        </div>
      </div>

      <div className='compartment-node-body row '>
        <div class="handlers left col">
          {Array.from({length: data.ins}, (_, index) => {
            return (<OrientationHandler id={index+1} type={"target"} position={"Left"}/>)
          })}
        </div>
        <div class="handlers right col"> 
          {Array.from({length: data.outs}, (_, index) => {
            return (<OrientationHandler id={index+1} type={"source"} position={"Right"}/>)
          })}
        </div>
        
      </div>
   
       
      {/* <Handle type="source" position={Position.Bottom} id="a" /> */}
    </div>
  );
}

export default memo(CompartmentNode);