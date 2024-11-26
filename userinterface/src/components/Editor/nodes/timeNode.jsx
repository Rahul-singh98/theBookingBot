import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

const handleStyle = { left: 10 };

export function TimeNode({ data }) {
    return (
        <>
            <div style={{ padding: "10px", background: "#fafafa", textAlign: "center" }}>
                <label>Time</label>
                <select>
                    <option value="HH:MM:SS">HH:MM:SS</option>
                    <option value="HH:MM:AM">HH:MM:AM</option>
                </select>
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
