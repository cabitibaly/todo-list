import React from "react";
import '../styles/signup.css';
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signupUser = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:1000/user', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });
        const data = await res.json();
        if(data) {
            navigate('/login')
        } else {
            navigate('/signup');
        }
    }

    return (
        <div className="signup">
            <div className="box">
                <h1>Sign Up</h1>
                <form className="form" onSubmit={signupUser}>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your Full-name"/>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your E-mail"/>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your Password"/>
                    <input className="submit" type="submit" value='Start now' />
                </form>
                <p>
                    Do you have a account ? 
                    <Link to='/login'> Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Login;