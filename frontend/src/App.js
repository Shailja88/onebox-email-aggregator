import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, CardContent, Typography } from "@mui/material";

const App = () => {
    const [emails, setEmails] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5001/api/emails")
            .then(res => {
                console.log("API Response:", res.data);  // ✅ Debugging ke liye
                setEmails(res.data.reverse());
            })
            .catch(err => console.error("Error fetching emails:", err));
    }, []);

    return (
        <Container>
            <h1>Email Aggregator</h1>
            {emails.map((email, index) => (
                <Card key={index} style={{ marginBottom: "10px", padding: "10px" }}>
                    <CardContent>
                        <Typography variant="h6">{email.subject || "No Subject"}</Typography>
                        <Typography variant="body2">
                            {email.body ? email.body : "No content available"} 
                        </Typography>
                        <Typography variant="caption">
                            Category: {email.category || "Uncategorized"}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Container>
    );
};

export default App;
