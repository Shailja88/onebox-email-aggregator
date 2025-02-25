import React from "react";
import ExpandableLink from "../components/ExpandableLink";

const stripHtmlAndCss = (html) => {
    // HTML parsing
    const doc = new DOMParser().parseFromString(html, "text/html");
    let textContent = doc.body.textContent || "";

    // CSS selectors & @media queries remove karna
    textContent = textContent.replace(/(@media[^{]*{[^}]*})|(\.[a-zA-Z0-9_-]+\s*{[^}]*})/g, "").trim();

    return textContent;
};

const formatEmailBody = (body) => {
    if (!body) return "No content available";

    // Pehle HTML + CSS remove karna
    const plainText = stripHtmlAndCss(body);

    // Regular expression to find URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return plainText.split(urlRegex).map((part, index) => {
        if (part.match(urlRegex)) {
            return <ExpandableLink key={index} text=" " url={part} />;
        }
        return part;
    });
};

export default formatEmailBody;
