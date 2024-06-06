import { useCallback, useMemo, useState } from 'react';
import { Background, Handle, Position, useUpdateNodeInternals, useStore, NodeProps } from 'reactflow';
import React, { memo, useEffect } from 'react';
import CompartmentHandle from '../compartment/CompartmentHandle';
import './style/FlowNodeStyle.css'

/**
 * Узел представляющий поток
 * @param {React.FC<NodeProps>} param0 
 * @returns 
 */



function FlowNode({ data, isConnectable }) {



    let all_ids = 0;

    const constructHandleId = (id, type) => {
      return "handle_flow_" + type + "_" + (++all_ids) + "_" + data.obj.id_;
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

    return (
        <div className='flow-node container'>
            <div className='row flow-node-header'>
                <div className='col-sm-8'>
                    <label htmlFor='text'> FLOW | prob: A({data.obj?.coef_}) </label>
                </div>
            </div>

            <div className='row flow-node-body'>
    {/* Выходные хендлеры должны показывать коэффициент перехода, в точности
        при создании новых, нужно чтобы пользователь задавал следующее распределение.
    */}
    <div className='info col'>
    </div>
    {/* <div className='induced col'>
        <button className='induced-button'> Check </button>
    </div> */}
    {/* При создании индуцированности должен создаваться новый хендл
        снизу.
    */}

    <OrientationHandler id={1} style={{top: positionHandle(1)}} type={"target"} position={"Left"}/>

    <div className='right-handler'>
        <OrientationHandler id={1} style={{top: positionHandle(1)}} type={"source"} position={"Right"}/>
        <span className='handler-text'>{data.obj.from_.name_ === "Suspectabsle" ? "0.1" : "1"}</span>
    </div>

    {data.obj.from_.name_ === "Suspectabsle" && (
        <div className='right-handler'>
            <OrientationHandler id={2} style={{top: positionHandle(2)}} type={"source"} position={"Right"}/>
            <span className='handler-text'>{data.obj.from_.name_ === "Suspectabsle" ? "0.9" : ""}</span>
        </div>
    )}
</div>


        </div>
    );
}

export default memo(FlowNode);