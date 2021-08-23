import React from 'react'
import logo from "../../asset/logo.png";
import { Link } from 'react-router-dom';
import { Avatar } from '@material-ui/core';
import { useAuth } from '../../context/AuthContext'
import './style.css'

function Navbar() {
    const { currentUser, logout } = useAuth()

    const handleLogout = async () => {
        try {
            await logout()
        } catch {
            alert('Failed to log out')
        }
    }

    return (
        <div className="navbar__container">
            <div className="navbar_logo">
                <img src={logo} alt="logo"></img>
                <p>Infinity</p>
            </div>
            <div className="navbar__headerRight">
                <Link style={{ "textDecoration": "none", "color": "white" }} to={`/dashboard`} >
                    <button className="navbar__linkbtn">
                        Home</button></Link>
                <Link style={{ "textDecoration": "none", "color": "white" }} to={`/user/${currentUser.displayName}/${currentUser.uid}`} >
                    <button className="navbar__linkbtn">
                        Profile</button></Link>
                <button onClick={handleLogout} className="navbar__logoutBtn">
                    Logout
                </button>
                
                <Link style={{ "textDecoration": "none", "color": "white" }} to={`/user/${currentUser.displayName}/${currentUser.uid}`} >
                <Avatar
                    className="navbar_avatar"
                    src={currentUser.photoURL}
                /></Link>
            </div>
        </div >
    )
}

export default Navbar
