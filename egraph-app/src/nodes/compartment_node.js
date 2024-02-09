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
      <div>
        <label htmlFor="text">Name: {data.name} </label>
        <label htmlFor="text">Pop: {data.population} </label>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />

    </>
  );
}

export default CompartmentNode;