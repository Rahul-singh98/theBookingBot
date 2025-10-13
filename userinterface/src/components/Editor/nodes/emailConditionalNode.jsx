import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

const handleStyle = { left: 10 };

export function EmailConditionalNode({ data }) {
    return (
        <>
            <div style={{ padding: "10px", textAlign: "center" }}>
                Email Conditional
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
