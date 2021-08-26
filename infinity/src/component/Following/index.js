import React, { useState, useEffect } from "react";
import { useAuth } from '../../context/AuthContext';
import FollowingProfile from './FollowingProfile'
import "./style.css";
import Modal from '@material-ui/core/Modal';

const Following = ({ following }) => {
    const [profiles, setprofiles] = useState(null);
    const { currentUser, getfollowedProfiles } = useAuth()
    const [open, setOpen] = useState(false);

    useEffect(() => {
        async function followedProfiles() {
            const response = await getfollowedProfiles(currentUser.uid, following);
            setprofiles(response);
        }
        followedProfiles();
    }, [currentUser.uid, following, getfollowedProfiles]);

    return !profiles ? (
        <div>
            <Modal
                open={open}
                onClose={() => setOpen(false)}>
                <div className="following__modal">
                    <h1>No followings</h1>
                </div>
            </Modal>
            <button className="following__button" onClick={() => setOpen(true)}>Following</button>
        </div>
    ) : profiles.length > 0 ? (
        <div>
            <Modal
                open={open}
                onClose={() => setOpen(false)}>
                <div className="following__modal">
                    <p className="font-bold text-grey-base following__text">
                        Following
                    </p>
                    <div className="following__container">
                        {profiles.map((profile) => (
                            <FollowingProfile
                                key={profile.docId}
                                userdocId={profile.docId}
                                username={profile.username}
                                userId={currentUser.uid}
                                avatar={profile.url}
                            />
                        ))}
                    </div>
                </div>
            </Modal>
            <button className="following__button" onClick={() => setOpen(true)}><p style={{ "marginBottom": "0" }} >Following</p></button>
        </div>

    ) : (<div>
        <Modal
            open={open}
            onClose={() => setOpen(false)}>
            <div className="following__modal">
                <h1>No followings</h1>
            </div>
        </Modal>
        <button className="following__button" onClick={() => setOpen(true)}><p style={{ "marginBottom": "0" }} >Following</p></button>
    </div>);
};

export default Following;
