import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

const handleStyle = { left: 10 };

export function NumberNode({ data }) {
    return (
        <>
            <div style={{ padding: "10px", textAlign: "center" }}>
                <label>Number</label>
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
