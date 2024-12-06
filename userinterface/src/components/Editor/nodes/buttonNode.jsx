import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

const handleStyle = { left: 10 };

export function ButtonNode({ data }) {
    return (
        <>
            <div>
                <label htmlFor="text">Button</label>
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
