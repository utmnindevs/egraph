import { useCallback, useMemo, useState } from 'react';
import { Background, Handle, Position, useUpdateNodeInternals, useStore, NodeProps } from 'reactflow';
import React, { memo, useEffect } from 'react';

/**
 * Узел представляющий поток
 * @param {React.FC<NodeProps>} param0 
 * @returns 
 */
function FlowNode({ data }) {
    return (
        <div className='flow-node container'>
            <div className='row flow-node-header'>
                <div className='col-sm-8'>
                    <label htmlFor='text'> ПОТОК </label>
                </div>
            </div>

            <div className='row flow-node-body'>
                {/* Выходные хендлеры должны показывать коэффициент перехода, в точности
                    при создании новых, нужно чтобы пользователь задавал следующее распределение.
                */}
                <div className='info'>
                    <label> Коэффициент перехода </label>
                </div>
                <div className='induced'>
                    <button> Check </button>
                </div>
                {/* При создании индуцированности должен создаваться новый хендл
                    снизу.
                */}
            </div>
        </div>
    );
}