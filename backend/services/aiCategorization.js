const classifyEmail = (emailContent) => {
    const lowerCaseContent = emailContent.toLowerCase();

    if (lowerCaseContent.includes("interested")) return "Interested";
    if (lowerCaseContent.includes("meeting")) return "Meeting Booked";
    if (lowerCaseContent.includes("not interested")) return "Not Interested";
    if (lowerCaseContent.includes("out of office")) return "Out of Office";
    if (lowerCaseContent.includes("unsubscribe") || lowerCaseContent.includes("spam")) return "Spam";

    return "Not Categorized";
};

module.exports = classifyEmail;
