import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

const handleStyle = { left: 10 };

export function DrowDownNode({ data }) {
    return (
        <>
            <div style={{ padding: "10px", background: "#fafafa", textAlign: "center" }}>
                <label>DropDown</label>
                <select>
                    {(data.options || []).map((option, idx) => (
                        <option key={idx} value={option.value}>
                            {option.htmlText}
                        </option>
                    ))}
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
