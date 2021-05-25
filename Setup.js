import firebase from '@react-native-firebase/app'
import storage from '@react-native-firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCf_KAAvsHD0Dp6XxiuHK2vkRpZj92Y2fM",
    authDomain: "awesomeproject1-700fa.firebaseapp.com",
    databaseURL:"https://awesomeproject1-700fa.firebaseapp.com",
    projectId: "awesomeproject1-700fa",
    storageBucket: "awesomeproject1-700fa.appspot.com",
    messagingSenderId: "1056325011422",
    appId: "1:1056325011422:web:8600742a1bb53d603b7f4f"
  };
  if(!firebase.apps.length){

    firebase.initializeApp(firebaseConfig)
  }


export default()=>{
return{firebase,storage}
}