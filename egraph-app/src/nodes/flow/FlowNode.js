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
                return (
                    <div className='left-handle-info'>
                        <Latex>${data.obj?.coef_name_} = {data.obj?.coef_.toFixed(3)}$</Latex>
                        <OrientationHandler id={data.ins[index]} style={{ top: positionHandle(index + 1) }} type={"target"} position={"Left"} />
                    </div>
            )})
    )

    const sourceHandles = useMemo(
        () =>
            Array.from({ length: data?.outs.length }, (_, index) => {
                return (
                    <OrientationHandler id={data.outs[index]} style={{ top: positionHandle(index + 1) }} type={"source"} position={"Right"} />
                    
                )
            })
    )

    const sourceCoefs = useMemo(
        () => {
            const result = [];
            data?.obj.to_coefs_.forEach((key, val) => {
                result.push(
                    (<>
                        <div>
                        <Latex>$p_{'{'}{data?.obj.from_?.GetName().slice(0,1).toLowerCase()}
                        {val.GetName().slice(0,1).toLowerCase()}{'}'}({key == 1 ? "1.0" : key})$</Latex> 
                        {/* {result.length} */}
                        </div>
                    </>)
                )
            })
            return result;
            }
    )

    return (
        <div className={'flow-node container '}>
            <div className='row flow-node-header'>
                <div className='col-sm-8'>
                    <label htmlFor='text'> Поток </label>
                </div>
            </div>

            <div className='row justify-content-md-center flow-node-body'>
                <div class="handlers left col col-4">
                    {targetHandles}
                </div>
                
                <div class="handlers right col-auto">
                    {sourceHandles}
                </div>
                <div className='right-handle-info col col-4'>
                    {sourceCoefs}
                </div>
                
            </div>
            {!data.corrected &&
                <div className='row error'>
                    <div className='col'>Ошибка!</div>
                </div>
            }
        </div>
    );
}

export default memo(FlowNode);