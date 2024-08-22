import React from "react";
import '../styles/login.css';
import { Link } from "react-router-dom";
import { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginUser = async (e) => {
        e.preventDefault();

        const res = await fetch('http://localhost:1000/user/login', {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await res.json();
        if(data) {
            localStorage.setItem('token', data.authToken);
            window.location.href = '/todo';
        } else {
            alert("Your E-mail or your password is incorrect");
        }
    }


    return (
        <div className="login">
            <div className="box">
                <h1>Login</h1>
                <form className="form" onSubmit={loginUser}>
                    <input type="email" placeholder="Enter your E-mail" onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="Enter your Password" onChange={e => setPassword(e.target.value)} />
                    <input className="submit" type="submit" value='Start now' />
                </form>
                <p>
                    No Account yet ? 
                    <Link to='/'> Sign Up</Link>
                </p>
            </div>
        </div>
    )
}

export default Login;