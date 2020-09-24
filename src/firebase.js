import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCDDw4ZgKNkUqw3GhaKW-ARUaYV_nTzBO0",
        authDomain: "sports-av.firebaseapp.com",
        databaseURL: "https://sports-av.firebaseio.com",
        projectId: "sports-av",
        storageBucket: "sports-av.appspot.com",
        messagingSenderId: "996099771618",
        appId: "1:996099771618:web:5245be7073534e5baee2bb",
        measurementId: "G-QLL6KG0EDN"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();


export { db, auth, storage};

