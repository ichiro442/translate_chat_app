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
      <div class="loginBtn" v-else key="logout">
        <button type="button" @click="doLogin">Login</button>
      </div>
    </header>
    <div
     class="pressBtn_msg flex"
     v-if="!user.uid"
     key="login"
     >
        <p>Use on google !</p>
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
  <!-- <adsense
      ad-client="★1"
      ad-slot="★2"
      ad-style="★3"
      ad-format="★4">
    </adsense> -->
</template>

<script src="./app.js"></script>

