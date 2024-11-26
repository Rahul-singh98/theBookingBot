import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

const handleStyle = { left: 10 };

export function StartNode({ data }) {
    return (
        <>
            <div>
                <label htmlFor="text">Start</label>
            </div>
            <Handle
                type="source"
                position={Position.Right}
            />
        </>
    );
}
