import { useCallback, useMemo, useState } from 'react';
import { Background, Handle, Position, useUpdateNodeInternals, useStore, NodeProps } from 'reactflow';
import React, { memo, useEffect } from 'react';

import "./style/CompartmentNodeStyle.css"
import SharedHandle from './CompartmentHandle';

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


  const constructHandleId = (id, type) => {
    return "handle_comp_" + type + "_" + (id) + "_" + data.name.substr(0, 2);
  }

  const positionHandle = (index) => {
    return 20 * index + 20;
  }

  /**
   * Конструирование хенделра путем его идентификатора, типа и позиции
   * @param {{number, string, string}} param0 -  
   * @returns 
   */
  function OrientationHandler({ id, type, style, position }) {
    return (
      <>
        <SharedHandle id={id} key={id}
          type={type}
          position={position === "Left" ? Position.Left : Position.Right}
          style={{ ...style }} isConnectable={isConnectable} nodeType={"comp"}

        />
      </>
    );
  }

  const targetHandles = useMemo(
    () =>
      Array.from({ length: data?.ins.length }, (_, index) => {
        return (<OrientationHandler id={data?.ins[index]} style={{ top: positionHandle(index + 1) }} type={"target"} position={"Left"} />)
      })
  )

  const sourceHandles = useMemo(
    () =>
      Array.from({ length: data?.outs.length }, (_, index) => {
        return (<OrientationHandler id={data?.outs[index]} style={{ top: positionHandle(index + 1) }} type={"source"} position={"Right"} />)
      })
  )


  return (
    <div class='compartment-node container'>
      <div class="row compartment-node-header ">
        <div class="col-sm-8">
          <label htmlFor="text"> {data.name.substr(0, 2).toUpperCase()}: {data.name} </label>
        </div>
        <div class="col-4 start-compartment-check">
          {/* <input class="form-check-radio nodrag" type="radio" value="" id="flexCheckDefault"></input> */}
        </div>
      </div>

      <div className='row compartment-node-body'>
        <div class="handlers left col">
          {targetHandles}
        </div>
        <div class="handlers right col">
          {sourceHandles}
        </div>

      </div>
    </div>
  );
}

export default memo(CompartmentNode);