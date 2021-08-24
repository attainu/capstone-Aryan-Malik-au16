import React, { useState } from 'react';
import logo from "../../asset/logo.png";
import { useAuth } from '../../context/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import './style.css';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const { login } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setError('')
            setLoading(true)
            await login(email, password)
            history.push('/dashboard')
        } catch (error) {
            setError(`${error.message}`)
        }
        setLoading(false)
    }

    return (
        <div className="login__container">
            {error && <div className="alert">
                <strong>ALERT !</strong> {error}
            </div>}
            <form className="login__form">
                <div className="login__logo">
                    <img
                        className="login__Image"
                        src={logo}
                        alt="HeaderImage" />
                </div>
                <div className="inputBox">
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="email">Email</label>
                </div>

                <div className="inputBox">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="password">Password</label>
                </div>
                <button disabled={loading} onClick={handleSubmit} className="login__button" type="submit" >login</button>
                <p className="login_link">Need an account? <Link style={{ "textDecoration": "none" }} to="/signUp">SignUp</Link></p>
            </form>
        </div>
    )
}

export default Login
