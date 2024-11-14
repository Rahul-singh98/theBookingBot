import React, { useEffect } from "react";

const JsonEmail = ({ targetName, onDataChange, initialData }) => {
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

export default JsonEmail;
