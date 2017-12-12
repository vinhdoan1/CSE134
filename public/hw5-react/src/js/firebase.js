// import firebase from '@firebase/app';
import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyC5ELIjf0XaLwgtOHKPjijx_p9Ihcg2fWA",
  firedatabaseKey: "AIzaSyC5ELIjf0XaLwgtOHKPjijx_p9Ihcg2fWA",
  authDomain: "cse134-bfd99.firebaseapp.com",
  databaseURL: "https://cse134-bfd99.firebaseio.com",
  projectId: "cse134-bfd99",
  storageBucket: "cse134-bfd99.appspot.com",
  messagingSenderId: "793962632230"
};

firebase.initializeApp(config);

export default firebase;
