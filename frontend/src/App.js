import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Container, Card, CardContent, Typography, Button } from "@mui/material";
import Login from "./auth/Login";
import formatEmailBody from "./utils/formatEmailBody";
import "./App.css";

const BASE_URL = "https://onebox-email-aggregator-1.onrender.com";

const App = () => {
    const [emails, setEmails] = useState([]);
    const [expandedEmails, setExpandedEmails] = useState({});
    const [error, setError] = useState(null);
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

    // ✅ fetchEmails ko stable banane ke liye useCallback use kiya
    const fetchEmails = useCallback(() => {
        if (!authToken) return;  // Agar token nahi hai toh API call mat karo

        axios.get(`${BASE_URL}/api/emails`, {
            headers: { Authorization: `Bearer ${authToken}` }
        })
        .then(res => {
            setEmails(res.data.reverse());
            setError(null);
        })
        .catch(err => {
            setError("Failed to load emails. Please log in again.");
            setAuthToken(null);
            localStorage.removeItem("authToken");
        });
    }, [authToken]); // ✅ Dependency array me sirf `authToken` rakha

    useEffect(() => {
        if (authToken) {
            fetchEmails();
            const interval = setInterval(fetchEmails, 10000);
            return () => clearInterval(interval);
        }
    }, [authToken, fetchEmails]); // ✅ fetchEmails ko bhi dependency array me rakha

    if (!authToken) {
        return <Login onLogin={(token) => setAuthToken(token)} />;
    }

    return (
        <div className="background">
            <Container maxWidth="md" className="container">
                <Typography variant="h4" className="heading">
                    🌌 Genie ReachInbox <span className="count">({emails.length} Messages)</span>
                </Typography>

                <Button 
                    variant="contained" 
                    className="button"
                    onClick={() => {
                        setAuthToken(null);
                        localStorage.removeItem("authToken");
                    }}
                >
                    Logout ❌
                </Button>

                {error && <Typography color="error">{error}</Typography>}

                <div className="cardContainer">
                    {emails.length > 0 ? (
                        emails.map((email, index) => (
                            <Card key={index} className="card">
                                <CardContent>
                                    <Typography variant="h6" className="subject">
                                        {email.subject || "No Subject"}
                                    </Typography>

                                    {expandedEmails[index] ? (
                                        <Typography variant="body2" className="body">
                                            {formatEmailBody(email.body)}
                                        </Typography>
                                    ) : (
                                        <Typography variant="body2" className="preview">
                                            {formatEmailBody(email.body ? email.body.substring(0, 50) + "..." : "No content available")}
                                        </Typography>
                                    )}

                                    <Typography variant="caption" className="category">
                                        Category: {email.category || "Uncategorized"}
                                    </Typography>

                                    <Button 
                                        size="small" 
                                        className="readMoreButton" 
                                        onClick={() => setExpandedEmails(prev => ({ ...prev, [index]: !prev[index] }))}
                                    >
                                        {expandedEmails[index] ? "Read Less ▲" : "Read More ▼"}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography>No emails found.</Typography>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default App;
