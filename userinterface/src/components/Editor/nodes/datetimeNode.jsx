import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

const handleStyle = { left: 10 };

export function DateTimeNode({ data }) {
    return (
        <>
            <div style={{ padding: "10px", background: "#fafafa", textAlign: "center" }}>
                <label>DateTime</label>
                <select>
                    <option value="DD-MM-YYYY:HH:MM">DD-MM-YYYY:HH:MM</option>
                    <option value="MM-DD-YYYY:HH:MM">MM-DD-YYYY:HH:MM</option>
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
