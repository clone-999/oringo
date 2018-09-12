import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBawWnfmz1tVxsVpGF_ujyKtUsuE4DiyYs",
  authDomain: "oringo-349f3.firebaseapp.com",
  databaseURL: "https://oringo-349f3.firebaseio.com",
  projectId: "oringo-349f3",
  storageBucket: "oringo-349f3.appspot.com",
  messagingSenderId: "99460807141"
}

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const settings = {
  timestampsInSnapshots: true
}
firestore.settings(settings)
export default firebase;
