import React from 'react'
import './style.css'
import PATHS from '../../config/path';
import video from '../../asset/0001.mp4';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="home__container"><div className="home__video">
            <video autoPlay muted loop >
                    <source src={video} type="video/mp4" />
                </video></div>
            <p className="home__text">
                <h1>Welcome To Infinity</h1>
                <h3>A social media platform where you can share your ideas and experience by uploading posts and commenting on others.</h3>
            </p>
            <div id="home__buttonContainer">
                <Link to={PATHS.SIGNUP}>
                    <button className="home__button">Signup</button></Link>
                <Link to={PATHS.LOGIN}>
                    <button className="home__button">
                        Login</button></Link>
            </div>
        </div>
    )
}

export default Home