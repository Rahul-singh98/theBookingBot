import React, { useEffect } from "react";

const JsonStart = ({ targetName, onDataChange, initialData }) => {
    useEffect(() => {
        onDataChange({
            "target": {
                "name": targetName,
                "value": {}
            }
        })
    }, [onDataChange])
    
    return <></>
};

export default JsonStart;
