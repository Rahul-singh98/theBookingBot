import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

const handleStyle = { left: 10 };

export function AddressNode({ data }) {
    return (
        <>
            <div style={{ padding: "10px", background: "#fafafa", textAlign: "center" }}>
                Address Node
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
