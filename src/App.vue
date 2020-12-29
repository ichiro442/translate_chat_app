<template>
  <div id="app">
    <header class="header">
      <h1>Hello Easy Talk</h1>
      <!-- ログイン時にはフォームとログアウトボタンを表示 -->
      <div class="loginBtn" v-if="user.uid" key="login">
        <!-- もしuserのidを持っていればloginできるよ -->
        <span class="userName">[{{ user.displayName }}]</span>
        <button type="button" @click="doLogout">Logout</button>
      </div>
      <!-- 未ログイン時にはログインボタンを表示 -->
      <div class="loginBtns" v-else key="logout">
        <button class="loginBtn g_btn" type="button" @click="doGoogleLogin">Google Login</button>
        <button class="loginBtn t_btn" type="button" @click="doTwitterLogin">Twitter Login</button>
        <button class="loginBtn f_btn" type="button" @click="doFacebookLogin">Facebook Login</button>
      </div>
    </header>
<section class="flex">
    <div
     class="pressBtn_msg flex"
     v-if="!user.uid"
     key="login"
     >
        <p>Use on Google !</p>
        <p>Press login button !</p>
    </div>
  <div class="" v-if="user.uid" key="logout">
      <!-- Firebase から取得したリストを描画（トランジション付き） -->
      <transition-group name="chat" tag="div" class="list content">
        <section v-for="{ key, name, image, message } in chat" :key="key" class="item">
          <div class="item-image"><img :src="image" width="40" height="40"></div>
          <div class="item-detail">
            <div class="item-name">{{ name }}</div>
            <div class="item-message">
              <nl2br tag="div" :text="message"/>
            </div>
          </div>
        </section>
      </transition-group>
  </div>
</section>
    <!-- 入力フォーム -->
    <form action="" @submit.prevent="doSend" class="form flex">
      <!-- submitが押されたら画面遷移をさせないpreventでdoSendを発動させるよ -->
        <div class="showText_box flex">
          <input
          class="choiceLangBtn"
          @click="showText = !showText" 
            :style="{ background:(showText ? '' : 'pink'), 
            border:(showText ? '' : 'none')}" 
          type="button" 
          value="Choice your language">
        <div 
            v-if="showText"
            class="lang_box flex">
          <p>
            <select class="langBefore" v-model="langBefore" name="choice">
              <option name="choice" value="en" selected >English</option>
              <option name="choice" value="ja">Japanese</option>
              <option name="choice" value="de">German</option>
              <option name="choice" value="zh-Hant">Chinese</option>
              <option name="choice" value="th">Thai</option>
            </select>
          </p>
          →
          <p>
            <select class="langAfter" v-model="langAfter" name="choice" id="">
              <option name="choice" value="ja" selected >Japanese</option>
              <option name="choice" value="en">English</option>
              <option name="choice" value="de">German</option>
              <option name="choice" value="zh-Hant">Chinese</option>
              <option name="choice" value="th">Thai</option>
            </select>
          </p>
        </div>
      </div>
      <div class="text_box flex">
        <textarea
          v-model="input"
          :disabled="!user.uid"
          @keydown.enter="trigger"></textarea>
          <!-- v-onv-bindをまとめて書いたv-modelでinputという変数 disabled無効にするuserがidをもっていなければ. keydown.enterはenterキーで動かすってこと exact精密にいうとimportant的な意味なのかな -->
        <button @click="changed" type="submit" :disabled="!user.uid" class="send-button button">Send</button>
        <!-- <div class="" v-if="showText">ボタンを押してください</div> -->
        <!-- useeridなければ無効化させるよ  -->
      </div>
    </form>
  </div>
</template>
<script>
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
      showText: false,
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
    doTwitterLogin(){
      const provider = new firebase.auth.TwitterAuthProvider()
      firebase.auth().signInWithPopup(provider)
    },
    doFacebookLogin(){
      const provider = new firebase.auth.FacebookAuthProvider()
        firebase.auth().signInWithPopup(provider)
        .then((result) => {
        alert('Hello, '+result.user.displayName+'!')
      })    
    },
    doGoogleLogin() {
        const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider)
      .then((result) => {
        alert('Hello, '+result.user.displayName+'!')
      })
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
      const message = snap.val()
      this.chat.push({
        // Firebaseから取得したメッセージ
        key: snap.key,
        name: message.name,
        image: message.image,
        message: message.message
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
</script>
