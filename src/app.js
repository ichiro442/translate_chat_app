import './assets/app.css'
// import VueAdsense from 'vue-adsense'
// firebase モジュール
import firebase from 'firebase'
// 改行を <br> タグに変換するモジュール
import Nl2br from 'vue-nl2br'
export default {
  components: { Nl2br },
  // 'adsense': VueAdsense,
  data() {
    return {
      user: {},  // ユーザー情報
      chat: [],  // 取得したメッセージを入れる配列
      input: '',  // 入力したメッセージ
      langBefore: '',
      langAfter: '',
      click: '',
      showText: false
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user ? user : {}
      const ref_message = firebase.database().ref('message')
      if (user) {
        this.chat = []
        // message に変更があったときのハンドラを登録
        ref_message.limitToLast(10).on('child_added', this.childAdded)
      } else {
        // message に変更があったときのハンドラを解除
        ref_message.limitToLast(10).off('child_added', this.childAdded)
      }
    })
  },
  methods: {
    // ログイン処理
    doLogin() {
      const provider = new firebase.auth.TwitterAuthProvider()
      firebase.auth().signInWithPopup(provider)
    },
    // ログアウト処理
    doLogout() {
      firebase.auth().signOut()
    },
    // スクロール位置を一番下に移動
    scrollBottom() {
      this.$nextTick(() => {
        window.scrollTo(0, document.body.clientHeight)
      })
    },
    // 受け取ったメッセージをchatに追加
    // データベースに新しい要素が追加されると随時呼び出される
    childAdded(snap) {
      //childAddedはアイテムのリスト,アイテムのリストへの追加するイベント snapってなに？
      const message = snap.val()
      this.chat.push({
        // Firebaseから取得したメッセージの配列が入ってる？のをpush送り出す！！scrollBottomへ
        key: snap.key,
        name: message.name,
        image: message.image,
        message: message.message
        //firebaseのデータベースに入っているやつ keyはよくわかわない
      })
      this.scrollBottom()
    },
    //エンターキーは受け付けない
    trigger(e) {
      if(e.keyCode !== 13)return
    },
    //メッセージ欄の未入力アラート
     changed () {
       if(this.input === ""){
         alert("Enter the message!")
       }
    },
    doSend() {
      this.axios.get(`https://script.google.com/macros/s/AKfycbw9zQVG2vM4jLcOnGk4uaJ89s8-hMoXSPTC5EACNH3uls6P0v8/exec?text=${this.input}&sorce=${this.langBefore}&target=${this.langAfter}`)
        .then((response) => {
          // console.log(response.data.text)
          if (this.user.uid && this.input.length) {
            // firebase にメッセージを追加
            console.log(this.input);
            console.log(this.langBefore);
            console.log(this.langAfter);
            firebase.database().ref('message').push({
              // message: this.input,
              message: response.data.text,
              name: this.user.displayName,
              image: this.user.photoURL
            }, () => {
              this.input = '' // フォームを空にする
            })
          }

        })
        .catch((e) => {
          alert(e);
        });
    }
  }
}
