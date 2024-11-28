import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

const handleStyle = { left: 10 };

export function ConditionalNode({ data }) {
    return (
        <>
            <div style={{ padding: "10px", textAlign: "center" }}>
                If/Else
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
