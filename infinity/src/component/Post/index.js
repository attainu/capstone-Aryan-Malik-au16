import React, { useState, useEffect, forwardRef } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
const Post = forwardRef(
    ({ username, postId, imageUrl, caption, avatarURL }, ref) => {
        const [comments, setComments] = useState([]);
        const [comment, setComment] = useState("");
        const [likes, setLikes] = useState([]);
        const [like, setLike] = useState(false);
        const likenum = likes.length;
        const [showComment, setShowComment] = useState(false);
        const { currentUser } = useAuth()
        useEffect(() => {
            let unsubscribe;
            if (postId) {
                unsubscribe = db
                    .collection("posts")
                    .doc(postId)
                    .collection("comments")
                    .onSnapshot((snapshot) => {
                        setComments(snapshot.docs.map((doc) => doc.data()));
                    });

                db.collection("posts")
                    .doc(postId)
                    .collection("likes")
                    .onSnapshot((snapshot) => {
                        setLikes(snapshot.docs.map((doc => ({
                            id: doc.id,
                            data: doc.data()
                        }))));
                    });
            }
            return () => {
                unsubscribe();
            };
        }, [postId]);

        useEffect(() => {
            likes.map(({ data }) => {
                if (data.username === currentUser.displayName) {
                    return setLike(true)
                }
                return true
            }
            )
        }, [likes, currentUser.displayName]);

        const likeData = (e) => {
            e.preventDefault();
            db.collection("posts").doc(postId).collection("likes").add({
                likes: 1,
                username: currentUser.displayName,
            });
            setLike(true)
        };

        const dislike = (e) => {
            e.preventDefault();
            likes.map(({ id, data }) => {
                if (data.username === currentUser.displayName) {
                    db.collection("posts").doc(postId).collection("likes").doc(id).delete();
                    setLike(false)
                }
                return true
            }
            )
        };

        const postComment = (e) => {
            e.preventDefault();
            db.collection("posts").doc(postId).collection("comments").add({
                text: comment,
                username: currentUser.displayName,
            });
            setComment("");
        };

        return (
            <div className="post" ref={ref}>
                <div className="post__header">
                    <Avatar
                        className="post__avatar"
                        src={avatarURL}
                    />
                    <div>{username}</div>
                </div>
                <img className="post__image" src={imageUrl} alt="post" />

                <div className="button__section">
                    {like ? (
                        <button
                            className="like__button"
                            type="submit"
                            onClick={dislike}
                        >
                            <svg aria-label="Unlike" className="_8-yf5 " fill="#ed4956" height="27" role="img" viewBox="0 0 48 48" width="27"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
                        </button>
                    ) : (<button
                        className="like__button"
                        type="submit"
                        onClick={likeData}
                    >
                        <svg aria-label="Like" className="_8-yf5 " fill="#262626" height="27" role="img" viewBox="0 0 48 48" width="27"><path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
                    </button>
                    )}
                    {showComment ? (
                        <button
                            className="comment__button"
                            type="submit"
                            onClick={() => setShowComment(false)}
                        >
                            <svg aria-label="Comment" className="_8-yf5 " fill="#0E86D4" height="27" role="img" viewBox="0 0 48 48" width="25"><path clipRule="evenodd" d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z" fillRule="evenodd"></path></svg>
                        </button>
                    ) : (<button
                        className="comment__button"
                        type="submit"
                        onClick={() => setShowComment(true)}
                    >
                        <svg aria-label="Comment" className="_8-yf5 " fill="#262626" height="27" role="img" viewBox="0 0 48 48" width="25"><path clipRule="evenodd" d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z" fillRule="evenodd"></path></svg>
                    </button>
                    )}

                    <div>{likenum} likes</div>
                </div>

                <div className="post__text">
                    <strong>{username}</strong>  {caption}
                </div>
                <hr className="post__hr"></hr>
                <div className="post__comments">
                    {showComment && (
                        comments.map((comment) => (
                            <div>
                                <p className="post__commentText"><b>{comment.username}</b> {comment.text}</p>
                            </div>
                        ))
                    )
                    }
                </div>

                <hr className="post__hr"></hr>
                <form className="post__commentBox">
                    <input
                        className="post__input"
                        type="text"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                        disabled={!comment}
                        className="post__button"
                        type="submit"
                        onClick={postComment}
                    >
                        Post
                    </button>
                </form>

            </div>
        );
    }
);

export default Post;
