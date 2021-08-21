import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'
import ImageUpload from '../../component/ImageUpload';
import { Avatar } from '@material-ui/core';
import { db } from '../../config/firebase';
import Post from '../../component/Post';
import Navbar from '../../component/Navbar';
import Suggestion from '../../component/Suggestion';
import './style.css'
import Following from '../../component/Following';

function Dashboard() {

    console.log(process.env)

    const [users, setusers] = useState();
    const { currentUser } = useAuth()
    const [posts, setPosts] = useState([]);
    const [display, setDisplay] = useState(false)
    useEffect(() => {
        db.collection('posts')
            .orderBy("timestamp", "desc")
            .onSnapshot(snapshot => {
                setPosts(snapshot.docs.map(doc => ({
                    id: doc.id,
                    post: doc.data()
                })));
            })
    }, []);
    useEffect(() => {
        db.collection('users')
            .onSnapshot(snapshot => {
                setusers(snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()
                })));
            })
    }, [currentUser.uid]);

    return (
        <div className="dashboard__container">
            <Navbar />

            <div className="dashboard__section">
                <div className="dashboard__sidebar">
                    <Avatar
                        className="dashboard_sidebaravatar"
                        src={currentUser.photoURL}
                    />
                    <p className="dashboard__displayName">{currentUser.displayName}</p>
                    <hr className="dashboard__hr" />
                    {users && (<div className="following">
                        {users.map(({ id, data }) => {
                            if (currentUser.uid === id) {
                                return <Following
                                    key={id}
                                    following={data.following}
                                />
                            }
                            return false
                        })}
                    </div>
                    )}

                    <ImageUpload username={currentUser.displayName} />
                </div>

                <div className="dashboard__main">
                    <div className="dashboard__posts">
                        {posts.map(({ id, post }) => (
                            <Post
                                key={id}
                                postId={id}
                                avatarURL={post.avatarUrl}
                                username={post.username}
                                caption={post.caption}
                                imageUrl={post.imageUrl}
                            />
                        ))}
                    </div>

                    {display ? (
                        <div className="responsive__suggestlist">
                            {users.map(({ id, data }) => {
                                if (currentUser.uid === id) {
                                    return <Suggestion
                                        userId={id}
                                        key={id}
                                        following={data.following}
                                    />
                                }
                                return false
                            })}
                        </div>
                    ) : users && (
                        <div className="suggested__list">
                            {users.map(({ id, data }) => {
                                if (currentUser.uid === id) {
                                    return <Suggestion
                                        userId={id}
                                        key={id}
                                        following={data.following}
                                    />
                                }
                                return false
                            })}
                        </div>
                    )}

                </div>
            </div>

            <div className="responsive__container">
                <div className="responsivebtn">
                    <button className="responsive__btn responsive__postbtn" onClick={() => (setDisplay(false))}>
                    </button>
                    <button className="responsive__btn responsive__followbtn">
                        {users && (
                            <div className="following">
                                {users.map(({ id, data }) => {
                                    if (currentUser.uid === id) {
                                        return <Following
                                            key={id}
                                            following={data.following}
                                        />
                                    }
                                    return false
                                })}
                            </div>
                        )}
                    </button>

                    <button className="responsive__btn responsive__suggestbtn" onClick={() => (setDisplay(true))}>
                    </button>
                    <button style={{ "border": "none" }} className="responsive__btn responsive__uploadbtn"> <ImageUpload username={currentUser.displayName} /></button>
                </div>
            </div>

        </div>
    )
}

export default Dashboard
