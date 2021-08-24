import React, { useState } from 'react';
import { storage } from "../../config/firebase";
import Modal from '@material-ui/core/Modal';
import logo from "../../asset/logo.png";
import Avatar from "@material-ui/core/Avatar";
import { useAuth } from '../../context/AuthContext';
import { Link , useHistory} from 'react-router-dom';
import './style.css'

function Signup() {
  const followers=[]
  const following=[]
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [url, setUrl] = useState("");
  const { signUp } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError('')
      setLoading(true)
      await signUp(url, username, email, password,followers,following)
      history.push('/dashboard')
    }
    catch (error){
      setError(`${error.message}`)
    }
    setLoading(false)
  }


  const AvatarUpload = (event) => {
    event.preventDefault();
    const uploadTask = storage.ref(`avatar/${avatar.name}`).put(avatar);
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
          .ref("avatar")
          .child(avatar.name)
          .getDownloadURL()
          .then((url) => {
            setUrl(url)
          });
        setAvatar(null);
      }
    );
  };


  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  return (
    <div className="signup__container">
      <Modal
        open={open}
        onClose={() => setOpen(false)}>
        <div className="signup__modal">
          <h2>Choose a file</h2>
          <progress className="Avatar__progress" value={progress} max="100" />
          <input type="file" onChange={handleChange} accept=".png, .jpg, .jpeg" />
          <button className="avatar__button" onClick={AvatarUpload}>
            Confirm
          </button>
        </div>
      </Modal>
      {error && <div className="alert">
        <strong>ALERT !</strong> {error}
      </div>}
      
      <form className="signup__form">
        <div className="signup__logo">
          <img
            className="signup__Image"
            src={logo}
            alt="HeaderImage" />
        </div>

        <div className="avatar__upload">
          <Avatar
            className="signup_avatar"
            src={url}
          />
          {!url ? (
            <button className="signup__uploadbutton" onClick={() => setOpen(true)}><p>Upload</p></button>
          ) : (
            <button className="signup__uploadbutton" onClick={() => setOpen(true)}><p>Uploaded</p></button>
          )}
        </div>

        <div className="inputBox">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="username">Username</label>
        </div>

        <div className="inputBox">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="email">Email</label>
        </div>

        <div className="inputBox">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
        </div>
        <button disabled={loading} className="signup__button" type="submit" onClick={handleSubmit}>Sign Up</button>
        <p className="signup_link">
          Already have an account? <Link style={{ "textDecoration": "none" }} to="/login">Login</Link></p>
      </form>
    </div>
  )
}

export default Signup