<template>
  <div id="app">
    <header class="header">
      <h1>Chat</h1>
      <!-- ログイン時にはフォームとログアウトボタンを表示 -->
      <div v-if="user.uid" key="login">
        <!-- もしuserのidを持っていればloginできるよ -->
        [{{ user.displayName }}]
        <button type="button" @click="doLogout">Logout</button>
      </div>
      <!-- 未ログイン時にはログインボタンを表示 -->
      <div v-else key="logout">
        <button type="button" @click="doLogin">Login</button>
      </div>
    </header>

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
  
    <!-- 入力フォーム -->
    <form action="" @submit.prevent="doSend" class="form">
      <!-- submitが押されたら画面遷移をさせないpreventでdoSendを発動させるよ -->
      <textarea
        placeholder="enter in English"
        v-model="input"
        :disabled="!user.uid"
        @keydown.enter="trigger"></textarea>
        <label>ja</label><input type="checkbox" v-model="langBefore"  value="en">
        <label>en</label><input type="checkbox" v-model="langAfter"  value="ja">
        <!-- v-onv-bindをまとめて書いたv-modelでinputという変数 disabled無効にするuserがidをもっていなければ. keydown.enterはenterキーで動かすってこと exact精密にいうとimportant的な意味なのかな -->
      <button type="submit" :disabled="!user.uid" class="send-button">Send</button>
      <!-- useeridなければ無効化させるよ  -->
    </form>
  </div>
</template>

<script>
// firebase モジュール
import firebase from 'firebase'
// 改行を <br> タグに変換するモジュール
import Nl2br from 'vue-nl2br'
export default {
  components: { Nl2br },
  data() {
    return {
      user: {},  // ユーザー情報
      chat: [],  // 取得したメッセージを入れる配列
      input: '',  // 入力したメッセージ
      langBefore: [],
      langAfter: []
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
    trigger(e) {
      if(e.keyCode !== 13)return
    },
    doSend() {
      this.axios.get(`https://script.google.com/macros/s/AKfycbw9zQVG2vM4jLcOnGk4uaJ89s8-hMoXSPTC5EACNH3uls6P0v8/exec?text=${this.input}&sorce=${this.langBefore[0]}&target=${this.langAfter[0]}`)
        .then((response) => {
          // console.log(response.data.text)
          if (this.user.uid && this.input.length) {
            // firebase にメッセージを追加
            console.log(this.input);
            // console.log(this.langBefore);
            // console.log(this.langAfter);
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

<style>
* {
  margin: 0;
  box-sizing: border-box;
}
.header {
  background: #3ab383;
  margin-bottom: 1em;
  padding: 0.4em 0.8em;
  color: #fff;
}
.content {
  margin: 0 auto;
  padding: 0 10px;
  max-width: 600px;
}
.form {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  height: 80px;
  width: 100%;
  background: #f5f5f5;
}
.form textarea {
  border: 1px solid #ccc;
  border-radius: 2px;
  height: 4em;
  width: calc(100% - 6em);
  resize: none;
}
.list {
  margin-bottom: 100px;
}
.item {
  position: relative;
  display: flex;
  align-items: flex-end;
  margin-bottom: 0.8em;
}
.item-image img {
  border-radius: 20px;
  vertical-align: top;
}
.item-detail {
  margin: 0 0 0 1.4em;
}
.item-name {
  font-size: 75%;
}
.item-message {
  position: relative;
  display: inline-block;
  padding: 0.8em;
  background: #deefe8;
  border-radius: 4px;
  line-height: 1.2em;
}
.item-message::before {
  position: absolute;
  content: " ";
  display: block;
  left: -16px;
  bottom: 12px;
  border: 4px solid transparent;
  border-right: 12px solid #deefe8;
}
.send-button {
  height: 4em;
}
/* トランジション用スタイル */
.chat-enter-active {
  transition: all 1s;
}
.chat-enter {
  opacity: 0;
  transform: translateX(-1em);
}
</style>
