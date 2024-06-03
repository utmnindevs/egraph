import { useCallback, useMemo, useState } from 'react';
import { Background, Handle, Position, useUpdateNodeInternals, useStore, NodeProps } from 'reactflow';
import React, { memo, useEffect } from 'react';

import CompartmentHandle from './CompartmentHandle';
 
const selector = (s) => ({
  nodeInternals: s.nodeInternals,
  edges: s.edges,
});
 
/**
 * 
 * @param {React.FC<NodeProps>} param0 
 * @returns 
 */
function CompartmentNode({ data, isConnectable }) {
  const nodeId = data.id;
  const updateNodeInternals = useUpdateNodeInternals();
  
  useEffect(() => {
    updateNodeInternals(nodeId)
  }, [])
  
  let all_ids = 0;

  const constructHandleId = (id, type) => {
    return "handle_comp_" + type + "_" + (++all_ids) + "_" + data.name.substr(0,2);
  }

  const positionHandle = (index) => {
    return 20* index + 20;
}

  /**
   * Конструирование хенделра путем его идентификатора, типа и позиции
   * @param {{number, string, string}} param0 -  
   * @returns 
   */
  function OrientationHandler({id, type, style, position}){
    const constructed_id = constructHandleId(id, type);
    return(
      <>
        <CompartmentHandle id={constructed_id} key={constructed_id} 
        type={type} 
        position={position === "Left" ? Position.Left : Position.Right}
        style = {{...style}} isConnectable={isConnectable}/>
      </>
    );
  }

  const targetHandles = useMemo(
    () =>
      Array.from({length: data.ins}, (_, index) => {
        return (<OrientationHandler id={index+1} style={{top: positionHandle(index + 1)}} type={"target"} position={"Left"}/>)
      }), [data.ins]
  )

  const sourceHandles = useMemo(
    () =>
      Array.from({length: data.outs}, (_, index) => {
        return (<OrientationHandler id={index+1} style={{top: positionHandle(index + 1)}} type={"source"} position={"Right"}/>)
      }), [data.outs]
  )

 
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

      <div key="test" className='compartment-node-body row '>
        <label>pop</label>
        <div class="handlers left col">
          {targetHandles}
        </div>
        <div class="handlers right col"> 
          {sourceHandles}
        </div>
        
      </div>
   
       
      {/* <Handle type="source" position={Position.Bottom} id="a" /> */}
    </div>
  );
}

export default memo(CompartmentNode);