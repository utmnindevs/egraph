import React from 'react';

import './style/SideBarAdding.css'


function SideBarAdding() {

    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
      };

    return (
        <div class="side-bar-adding-body">
            <p class="header"> Создание узла </p>

            <div class="blocks ">
                <div class="compartment">
                    <div class='compartment-node container dndnode'onDragStart={(event) => onDragStart(event, 'compartmentNode')} draggable>
                        <div class="row compartment-node-header ">
                            <div class="col-sm-8">
                                <label htmlFor="text"> Компартмент </label>
                            </div>
                        </div>
                        <div className='compartment-node-body row '></div>
                    </div>


                </div>

                <div class="flow ">
                <div class='flow-node container'>
                        <div class="row flow-node-header ">
                            <div class="col-sm-8">
                                <label htmlFor="text"> Поток </label>
                            </div>
                        </div>
                        <div className='flow-node-body row '></div>
                    </div>
                </div>

            </div>


        </div>
    )
}


export default SideBarAdding;