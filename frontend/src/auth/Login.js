import React, { useState } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import "./auth.css";  // Import styles

const BASE_URL = "http://localhost:5001";  // Backend URL

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            console.log("Sending request:", { email, password }); // Debugging log
        
            const response = await axios.post(`${BASE_URL}/api/auth/login`, { email, password },            { headers: { "Content-Type": "application/json" }} );

            console.log("Response received:", response.data);



            const { token } = response.data;
            localStorage.setItem("authToken", token);  // Store JWT in localStorage
            onLogin(token);
        } catch (err) {
            console.error("Login error:", err.response ? err.response.data : err.message);

            setError("Invalid credentials. Try again!");
        }
    };

    return (
        <Container className="loginContainer">
            <Typography variant="h5" className="heading">🔐 Secure Login</Typography>
            {error && <Typography color="error">{error}</Typography>}
            
            <TextField 
                fullWidth 
                label="Email" 
                variant="outlined" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="inputField"
            />

            <TextField 
                fullWidth 
                type="password"
                label="Password" 
                variant="outlined" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="inputField"
            />

            <Button 
                variant="contained" 
                className="button"
                onClick={handleLogin}
            >
                Login 🚀
            </Button>
        </Container>
    );
};

export default Login;
