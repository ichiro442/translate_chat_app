// import firebase from '@/plugins/firebase'
import firebase from 'firebase'

export default {
  asyncData () {
    return {
      isWaiting: true,
      isLogin: false,
      user: []
    }
  },
  mounted: function () {
    firebase.auth().onAuthStateChanged(user => {
      this.isWaiting = false
      if (user) {
        this.isLogin = true
        this.user = user
      } else {
        this.isLogin = false
        this.user = []
      };
    })
  },
  methods: {
    facebookLogin () {
      const provider = new firebase.auth.FacebookAuthProvider()
      firebase.auth().signInWithRedirect(provider)
    },
    logOut () {
      firebase.auth().signOut()
    }
  }
}
