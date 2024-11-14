import React, { useEffect } from "react";

const JsonInput = ({ targetName, onDataChange, initialData }) => {
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

export default JsonInput;
