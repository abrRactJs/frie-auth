
import React, { useState } from 'react';
import { initializeApp } from "firebase/app"
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";
import firebaseConfig from './firebase.config';

const firebaseApp = firebase.initializeApp(firebaseConfig)

const App = () => {
  const [newUser, setNewUser] = useState(false)
  const [user, setUser] = useState({
    isSignIn: false,
    name: "",
    email: "",
    password: '',
    photo: "",
    error: '',

  })

  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const handleSignIn = () => {
    console.log("handle sign in")

    signInWithPopup(auth, provider)
      .then(res => {
        const { email, displayName, photoURL } = res.user
        console.log(res)
        const signInUser = {
          isSignIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        }
        setUser(signInUser)
      })

  }

  const handleSignOut = () => {
    console.log("singout clicked")
    signOut(auth)
      .then(() => {
        const userSignOut = {
          isSignIn: false,
          name: '',
          email: '',
          photo: '',
        }
        setUser(userSignOut)
      })

  }



  // const handleSignIn = () => {
  //   console.log("handle sign in")
  //   const auth = getAuth();
  //   signInWithPopup(auth, provider)
  //     .then((result) => {
  //       // This gives you a Google Access Token. You can use it to access the Google API.
  //       const credential = GoogleAuthProvider.credentialFromResult(result);
  //       const token = credential.accessToken;
  //       // The signed-in user info.
  //       const user = result.user;
  //       // ...
  //     }).catch((error) => {
  //       // Handle Errors here.
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       // The email of the user's account used.
  //       const email = error.customData.email;
  //       // The AuthCredential type that was used.
  //       const credential = GoogleAuthProvider.credentialFromError(error);
  //       // ...
  //     });


  // }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(user.email, user.password)
    if (newUser && user.email && user.password) {
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          const user = userCredential.user;
          const newUserInfo = { ...user };
          newUserInfo.error = "";
          setUser(newUserInfo)
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.code;
          setUser(newUserInfo)
        });

      if (!newUser && user.email && user.password) {
        signInWithEmailAndPassword(auth, user.email, user.password)
          .then((userCredential) => {

            const user = userCredential.user;
            const newUserInfo = { ...user };
            newUserInfo.error = "";
            setUser(newUserInfo)

          })
          .catch((error) => {
            const newUserInfo = { ...user };
            newUserInfo.error = error.code;
            setUser(newUserInfo)
          });
      }

    }
  }

  const handleBlur = (event) => {

    console.log(event.target.name, event.target.value)
    let isFormValid = true;

    if (event.target.name === "email") {
      isFormValid = /\S+@\S+\.\S+/.test(event.target.value);
    }

    if (event.target.name === "password") {
      const validPass = event.target.value.length > 8;
      isFormValid = validPass;
    }

    if (isFormValid) {
      // [...cart, newItems] . update state rules
      const newUserInfo = { ...user };
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo)
    }
  }



  return (
    <div style={{ textAlign: "center" }}>
      <h2>home</h2>
      {user.isSignIn ? <button onClick={handleSignOut}>Sign out </button> :
        <button onClick={handleSignIn}>Sign In </button>
      }
      {
        user.isSignIn && <div>
          <h2> Welcome Mr. {user.name}</h2>
          <p>{user.email}</p>
          <img src={user.photoURL} alt="" />
        </div>
      }

      {/* login form is start here */}
      {/* 
<h1>Our Own Authyentication</h1>
<p>Name : {user.name}</p>
<p>email : {user.email}</p>
<p>password : {user.password}</p> */}

      <br /><br />
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
      <label htmlFor="newUSer">New User Sign Up</label>
      <form onSubmit={handleSubmit}>
        {newUser && < input name='name' type="text" onBlur={handleBlur} required placeholder='Name' />} <br />
        <input type="text" name='email' onBlur={handleBlur} placeholder='Enter Your email' required /> <br />
        <input type="password" name="password" onBlur={handleBlur} placeholder='Enter Your APassword' required /><br />
        <input type="submit" />
        <p style={{ color: "red" }}>{user.error}</p>
      </form>




    </div>
  );
};

export default App;




