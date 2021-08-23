import React, { useState } from "react";
import firebase from "firebase";
import { storage, db } from "../../config/firebase";
import { useAuth } from '../../context/AuthContext'
import "./style.css";
import { Input } from "@material-ui/core";
import Modal from '@material-ui/core/Modal';

const ImageUpload = ({ username }) => {

    const { currentUser } = useAuth()
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState("");
    const [open, setOpen] = useState(false);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };


    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("posts").add({
                            imageUrl: url,
                            caption: caption,
                            username: username,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            avatarUrl: currentUser.photoURL
                        });
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                        setOpen(false);
                    });
            }
        );
    };
    return (
        <div className="imageupload">
            <Modal
                open={open}
                onClose={() => setOpen(false)}>
                <div className="imageupload__modal">
                    <progress className="imageupload__progress" value={progress} max="100" />
                    <Input
                        style={{
                            "paddingTop": "20px",
                            "marginBottom": "30px",
                            "width": "90%"
                        }}
                        placeholder="Enter a caption"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />

                    <div className="imageupload__btnContainer">
                        <input type="file" onChange={handleChange} />
                        <button className="imageupload__button" onClick={handleUpload}>
                            Upload
                        </button>
                    </div>
                </div>
            </Modal>

            <button className="upload__button" onClick={() => setOpen(true)}><p>upload</p></button>
        </div>

    );
};

export default ImageUpload;
