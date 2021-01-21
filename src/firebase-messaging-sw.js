importScripts('https://www.gstatic.com/firebasejs/8.2.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.2/firebase-messaging.js');


firebase.initializeApp({
  apiKey: "AIzaSyDZa2UQf82_gHZGmnifao2iU26GLFdp0_E",
  authDomain: "deal-on-store.firebaseapp.com",
  projectId: "deal-on-store",
  storageBucket: "deal-on-store.appspot.com",
  messagingSenderId: "209942579610",
  appId: "1:209942579610:web:a30f106a5b8a09d12c5223",
  measurementId: "G-PNL5H6EPLL"
  });
  const messaging = firebase.messaging();