import React, { useState, useEffect } from 'react'
import SuggestedProfiles from './SuggestedProfile';
import Skeleton from 'react-loading-skeleton';
import { useAuth } from '../../context/AuthContext'
import './style.css';

function Suggestions({userId,following}) {
    const [profiles, setprofiles] = useState(null);
    const {getSuggestedProfiles } = useAuth()

    useEffect(() => {
        async function suggestedProfiles() {
            const response = await getSuggestedProfiles(userId,following);
            setprofiles(response);
        }
        suggestedProfiles();
    }, [userId,following,getSuggestedProfiles]);

    return !profiles ? (
        <div style={{ "width": "20%" }}>
            <Skeleton count={1} width={300} height={150} className='mt-5' />
        </div>
    ) : profiles.length > 0 ? (
        <div className="suggested_content ">
            <p className="font-bold text-grey-base suggestion__text">
                Suggestion For You
            </p>
            <div className="grid gap-5"> 
            {profiles.map((profile)=>(
                <SuggestedProfiles
                    key={profile.docId}
                    userdocId={profile.docId}
                    username={profile.username}
                    userId={userId}
                    avatar={profile.url}
                    />
            ))}
            </div>
        </div>
    ) : null;
}

export default Suggestions
