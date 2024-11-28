import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

const handleStyle = { left: 10 };

export function EndNode({ data }) {
    return (
        <>
            <div>
                <label htmlFor="text">End</label>
            </div>
            <Handle
                type="target"
                position={Position.Left}
            />
        </>
    );
}
