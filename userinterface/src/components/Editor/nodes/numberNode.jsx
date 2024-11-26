import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

const handleStyle = { left: 10 };

export function NumberNode({ data }) {
    return (
        <>
            <div style={{ padding: "10px", background: "#fafafa", textAlign: "center" }}>
                <label>Number</label>
                <input
                    type="number"
                    defaultValue={data.default || 0}
                    min={data.min || 0}
                    max={data.max || 100}
                    step={data.step || 1}
                />
            </div>

            <Handle
                type="source"
                position={Position.Right}
            />
            <Handle
                type="target"
                position={Position.Left}
            />
        </>
    );
}
