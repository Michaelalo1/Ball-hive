import React, { useState, useEffect } from 'react'
import './Post.css'
import Avatar from "@material-ui/core/Avatar";
import { db } from './firebase';
import firebase from 'firebase';

function Post({postId, user, imageUrl, caption, username}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');


    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                });
        }
        return () => {
            unsubscribe();
        };
    }, [postId])

    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    return (
        <div className="post">
            <div className="post-header">
                <Avatar
                className="post-avatar"
                alt='Cristiano'
                src={imageUrl}
                />
                <h3>{username}</h3>
            </div>

            <img className="post-image"
            src={imageUrl}
            alt=""/>
            {/* Image */}

            <h4 className="post-text"><strong>{username}</strong> {caption}</h4>
            {/* Username + Caption */}

            <div className="post-comments">
                {comments.map((comment) => (
                    <p>
                        <strong> {comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>

            {user && (
                <form className="comment-box">
                    <input 
                    className="post-input"
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange = {(e) => setComment(e.target.value)}
                    />

                    <button
                    disabled={!comment}
                    className="post-button"
                    type="submit"
                    onClick={postComment}
                    >   Post
                    </button>
                </form>
            )}
            
        </div>
    )
}

export default Post
