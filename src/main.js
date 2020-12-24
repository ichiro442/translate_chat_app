import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
 /* import Firebase */
import firebase from 'firebase'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyAi1beesNa-xkSikXMM1Pl3gbgxSXMcQIQ",
    authDomain: "chat-app-bd90a.firebaseapp.com",
    databaseURL: "https://chat-app-bd90a-default-rtdb.firebaseio.com",
    projectId: "chat-app-bd90a",
    storageBucket: "chat-app-bd90a.appspot.com",
    messagingSenderId: "529935428182",
    appId: "1:529935428182:web:21d926724357728e7629f7",
    measurementId: "G-SH8MZZNSTE"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  
  new Vue({
  render: h => h(App),
}).$mount('#app')

