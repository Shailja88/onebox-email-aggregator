import React, { useState } from "react";

const ExpandableLink = ({ text, url }) => {
    const [showURL, setShowURL] = useState(false);

    return (
        <span>
            {text}{" "}
            <span
                style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                onClick={() => setShowURL(!showURL)}
            >
                {showURL ? "Hide Link" : "link"}
            </span>
            {showURL && <span style={{ color: "blue" }}> {url}</span>}
        </span>
    );
};

export default ExpandableLink;
