import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
 
const handleStyle = { left: 10 };
 
function CompartmentNode({ data }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
 
  return (
    <>
      <Handle type="target" position={Position.Top} />
        
      <div><p><label htmlFor="text">Name: {data.name} </label></p>
        <label htmlFor="text">Pop: {data.population.toFixed(2)} </label>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}

export default CompartmentNode;