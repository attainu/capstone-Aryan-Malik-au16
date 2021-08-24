import React, { useEffect, useState } from 'react'
import { db } from '../../config/firebase';
import Post from '../../component/Post';
import './style.css';
import { Avatar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Navbar from '../../component/Navbar';

function ProfileDetails(props) {
    const username = props.match.params.username
    const userid = props.match.params.id
    const [posts, setPosts] = useState([]);
    const [user, setusers] = useState(null);

    useEffect(() => {
        db.collection('posts')
            .orderBy("timestamp", "desc")
            .onSnapshot(snapshot => {
                setPosts(snapshot.docs.map(doc => ({
                    id: doc.id,
                    post: doc.data()
                })));
            })

        db.collection("users")
            .doc(userid)
            .get()
            .then((docRef) => { setusers(docRef.data()) })
    }, [userid]);

    const countpost = () => {
        let count = 0
        posts.map(({ post }) => {
            if (post.username === username) {
                return count += 1
            }
            return false
        }
        )
        return count
    }
    return (
        <div className="profile__container">
            <Navbar />
            <div className="profile__info">
                {user && (
                    <div class="container">
                        <div class="profile">
                            <div class="profile-image">
                                <Avatar className="profile__Avatar"
                                    src={user.url}
                                ></Avatar>
                            </div>
                            <div class="profile-user-settings">
                                <h1 class="profile-user-name">{user.username}</h1>
                            </div>
                            <div class="profile-stats">
                                <ul>
                                    <li><span class="profile-stat-count">{countpost()}</span> posts</li>
                                    <li><span class="profile-stat-count">{user.followers.length}</span> followers</li>
                                    <li><span class="profile-stat-count">{user.following.length}</span> following</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            <h1>POSTS</h1>
            <div className="profile__posts">
                {posts.map(({ id, post }) => {
                    if (post.username === username) {
                        return <div className="profile__grid">
                            <Post
                                key={id}
                                postId={id}
                                avatarURL={post.avatarUrl}
                                username={post.username}
                                caption={post.caption}
                                imageUrl={post.imageUrl}
                            />
                        </div>
                    }
                    return true
                })}
            </div>
            
            <div className="responsive__container">
                <div className="responsivebtn">
                    <Link style={{ "textDecoration": "none", "color": "white" }} to={`/dashboard`} >
                        <button className="profile__linkbtn">
                        </button>
                    </Link>
                </div>
            </div>

        </div>
    )
}

export default ProfileDetails