import { useCallback, useMemo, useState } from 'react';
import { Background, Handle, Position, useUpdateNodeInternals, useStore, NodeProps } from 'reactflow';
import React, { memo, useEffect } from 'react';
import Latex from 'react-latex-next';

import './style/FlowNodeStyle.css'
import SharedHandle from '../compartment/CompartmentHandle';

/**
 * Узел представляющий поток
 * @param {React.FC<NodeProps>} param0 
 * @returns 
 */
function FlowNode({ data, isConnectable }) {
    const ConstructHandleId = (id, type, side) => {
        return "handle_flow_" + type + "_" + (id) + "_" + side;
    }
    const positionHandle = (index) => {
        return 20* index + 20;
    }

    function OrientationHandler({ id, type, style, position }) {
        return (
            <>
                <SharedHandle id={id} key={id}
                    type={type}
                    position={position === "Left" ? Position.Left : Position.Right}
                    style={{ ...style }} isConnectable={isConnectable} nodeType={"flow"}
                />
            </>
        );
    }

    const targetHandles = useMemo(
        () =>
            Array.from({ length: data?.ins.length }, (_, index) => {
                return (<OrientationHandler id={data.ins[index]} style={{ top: positionHandle(index + 1) }} type={"target"} position={"Left"} />)
            })
    )

    const sourceHandles = useMemo(
        () =>
            Array.from({ length: data?.outs.length }, (_, index) => {
                return (<OrientationHandler id={data.outs[index]} style={{ top: positionHandle(index + 1) }} type={"source"} position={"Right"} />)
            })
    )

    return (
        <div className='flow-node container'>
            <div className='row flow-node-header'>
                <div className='col-sm-8'>
                    <label htmlFor='text'> FLOW | <Latex>${data.obj?.coef_name_} = {data.obj?.coef_}$</Latex> </label>
                </div>
            </div>

            <div className='row flow-node-body'>
                <div class="handlers left col">
                    {targetHandles}
                </div>
                <div class="handlers right col">
                    {sourceHandles}
                </div>
                <div className='info col'>
                </div>
                {/* <div className='induced col'>
                    <button className='induced-button'> Check </button>
                </div> */}
                {/* При создании индуцированности должен создаваться новый хендл
                    снизу.
                */}
            </div>
        </div>
    );
}

export default memo(FlowNode);