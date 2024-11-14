import React, { useEffect } from "react";

const JsonAddress = ({ targetName, onDataChange, initialData }) => {
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

export default JsonAddress;
