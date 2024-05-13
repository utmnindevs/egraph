import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
 
const handleStyle = { left: 10 };
 
function CompartmentNode({ data }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
 
  return (
    <div className='compartment-node'>
      <div className='compartment-node-header'>
        <label htmlFor="text"> {data.name.substr(0,2).toUpperCase()}: {data.name} </label>
        
      </div>

      <div className='compartment-node-body'>
        <label htmlFor="text">Population: {data.population.toFixed(2)} </label>
      </div>
   
      {/* <Handle type="target" position={Position.Top} /> */}        
      {/* <Handle type="source" position={Position.Bottom} id="a" /> */}
    </div>
  );
}

export default CompartmentNode;