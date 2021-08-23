import React, { useState } from 'react'
import { Avatar } from '@material-ui/core';
import './style.css';
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom';

function FollowingProfile({ userdocId, username, userId, avatar }) {
    const [followed, setFollowed] = useState(false);
    const { updateLoggedInUserFollowing, updateFollowedUserFollowing } = useAuth()
    async function handleFollowUser() {
        setFollowed(true)
        await updateLoggedInUserFollowing(userdocId, userId, true);
        await updateFollowedUserFollowing(userId, userdocId, true);
    }

    return !followed ? (
            <div className="followed__users">
                <Link style={{ "textDecoration": "none", "color": "black" }} to={`/user/${username}/${userdocId}`} >
                    <div className="followed__username">
                        <Avatar
                            className="suggestions__avatar"
                            src={avatar}
                        >
                        </Avatar>
                        {username}</div>
                </Link>
                <button className="followed__followbtn" onClick={handleFollowUser}>Unfollow</button>
            </div>
    ) : null;
}

export default FollowingProfile
