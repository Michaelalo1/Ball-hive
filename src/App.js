import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './Post'
import { db, auth } from './firebase';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';
import Avatar from "@material-ui/core/Avatar";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in... 
        console.log(authUser);
        setUser(authUser);
      } else {
        //user has logged out... 
        setUser(null);
      }
    })
    return () => {
      //perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message))
  }

  const signIn = (event) => {
    event.preventDefault();
    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false);
  }

   
  return (
    <div className="App">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app-signup">
            <center>
              <img className="app-headerImage"
              src="https://flamechurch1.000webhostapp.com/wp-content/uploads/2020/09/sav-1.jpeg" 
              height="30px" width="100px"
              alt="Logo"/>
            </center>
            <Input 
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input 
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
           <Button type="submit" onClick={signUp}>Sign Up</Button> 
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app-signup">
            <center>
              <img className="app-headerImage"
              src="https://flamechurch1.000webhostapp.com/wp-content/uploads/2020/09/sav-1.jpeg" 
              height="30px" width="100px"
              alt="Logo"/>
            </center>
          
            <Input 
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
           <button type="submit" onClick={signIn}>Sign In</button> 
          </form>
        </div>
      </Modal>
      <div className="app-header">
        <img className="app-headerImage"
        src="https://flamechurch1.000webhostapp.com/wp-content/uploads/2020/09/sav-1.jpeg" 
        height="50px" width="120px"
        alt="Logo"/>

        <div className="headerUser">
          {user && (
                <Avatar
                className="post-avatar"
                alt={user.displayName}
                src='https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png'/>
              )}

          {user && (
            <strong>{user.displayName}</strong>
          )}
        </div>

        {user ? (
              <button type="submit" onClick={() => auth.signOut()}>LOGOUT</button>
            ): (
              <div className="app-loginContainer">
                <button onClick={() => setOpenSignIn(true)}>SIGN IN</button>
                <button onClick={() => setOpen(true)}>SIGN UP</button>
              </div>
            )}

        
      </div>
      
      <div className="app-posts">
        <div className="app-postsLeft">
          {
          posts.map(({id, post}) => (
          <Post key={id} postId={id} user={user} username={post.username} imageUrl={post.imageUrl} caption={post.caption} />
          ))
          }
        </div>

        <div className="app-postsRight">
          <InstagramEmbed
            url='https://www.instagram.com/p/B7jKYy2A1-L/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
          
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ) : (
        <h3>Login to upload</h3>
      )}
    
    </div>
  );
}

export default App;
