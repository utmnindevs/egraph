import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import React, { memo } from 'react';

import CustomHandle from './CustomHandle';
 
const handleStyle = { left: 10 };
 
function CompartmentNode({ data }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
 
  return (
    <div class='compartment-node container'>
      <div class="row compartment-node-header ">
        <div class="col-sm-8">
          <label htmlFor="text"> {data.name.substr(0,2).toUpperCase()}: {data.name} </label>
        </div>
        <div class="col-4 start-compartment-check">
          <input class="form-check-radio nodrag" type="radio" value="" id="flexCheckDefault"></input>
        </div>
      </div>

      <div className='compartment-node-body nodrag row'>
        {/* <label htmlFor="text">Population: {data.population.toFixed(2)} </label> */}
        <CustomHandle id='compartment_handle2' type="target" position={Position.Left} />        
        <CustomHandle id='compartment_handle1' type="target" style={{top:60}} position={Position.Left} />        
        <CustomHandle id='compartment_handle3' type="source" position={Position.Right} />        
      </div>
   
       
      {/* <Handle type="source" position={Position.Bottom} id="a" /> */}
    </div>
  );
}

export default memo(CompartmentNode);