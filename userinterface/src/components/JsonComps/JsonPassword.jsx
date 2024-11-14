import React, { useEffect } from "react";

const JsonPassword = ({ targetName, onDataChange, initialData }) => {
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

export default JsonPassword;
