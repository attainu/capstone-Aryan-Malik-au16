import React, { useState} from 'react'
import { Avatar } from '@material-ui/core';
import './style.css';
import {useAuth} from '../../context/AuthContext'
import { Link } from 'react-router-dom';

function SuggestedProfile({ userdocId, username, userId, avatar }) {
    const [followed, setFollowed] = useState(false);
    const {updateLoggedInUserFollowing,updateFollowedUserFollowing}= useAuth()
    async function handleFollowUser(){
            setFollowed(true)
        await updateLoggedInUserFollowing(userdocId,userId,false);
        await updateFollowedUserFollowing(userId,userdocId,false);
    }

    return !followed ?(
            <div className="suggested__users">
            <Link style={{ "textDecoration": "none", "color": "black" }} to={`/user/${username}/${userdocId}`} >
                <div className="suggested__username">
                    <Avatar
                        className="suggestions__avatar"
                        src={avatar}
                    >
                    </Avatar>
                        {username}</div>
                    </Link>
                <button className="suggested__followbtn" onClick={handleFollowUser}>Follow</button>
                <br />
            </div>
    ): null;
}

export default SuggestedProfile
