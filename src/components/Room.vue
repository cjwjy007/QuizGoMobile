<template>
  <div>
    <mt-header title="quiz">
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button icon="more" slot="right"></mt-button>
    </mt-header>
    <div class="page-body">
      <div class="user-card-set">
        <div class="user-card" v-for="client in clients">
          <div v-if="!isGameStart">
            <sup class="user-card-badge" v-if="client.owner">
              <mt-badge type="primary">房主</mt-badge>
            </sup>
            <sup class="user-card-badge" v-if="!client.owner && client.ready">
              <mt-badge type="primary">已准备</mt-badge>
            </sup>
          </div>
          <div v-else>
            <sup class="user-card-badge">
              <mt-badge type="primary">{{client.score}}</mt-badge>
            </sup>
          </div>
          <img :src="client.avatar">
          <div>{{client.username}}</div>
        </div>
      </div>
      <div v-if="!isGameStart">
        <div v-if='isOwner' class="game-button-div">
          <mt-button type="primary" size="large" @click="startGame">开始游戏</mt-button>
        </div>
        <div v-else class="game-button-div">
          <mt-button type="primary" size="large" @click="readyGame">
            <div v-if="isReady">
              已准备
            </div>
            <div v-else>
              准备
            </div>
          </mt-button>
        </div>
      </div>
      <div v-else>
        <div class="game-button-div">
          <mt-button type="primary" size="large">游戏中</mt-button>
        </div>
      </div>
      <div class="game">
        <div class="msg-box" id="msg-box">
          <span v-for="content in contents">
            {{content}}
            <br>
          </span>
        </div>
        <div class="msg-send">
          <form class="msg-send-form" @submit.prevent="">
            <input placeholder="请输入内容" v-model="msg">
            <div class="msg-send-button">
              <mt-button type="primary" @click="sendMsg">发送</mt-button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <mt-popup class="question-board"
              v-model="gameBoardVisible"
              popup-transition="popup-fade"
              :closeOnClickModal="false">
      <div>
        <h1 class="question-time">
          {{time}}
        </h1>
        <p class="question-title">
          {{question}}
        </p>
        <div v-for="(choice, index) in choices">
          <div class="question-answer-cell">
            <mt-button size="large" :type="choice.type" @click="onAnswer(choice.text,index)">
              <span class="question-text">
                {{choice.text}}
              </span>
              <div class="question-score" v-if="'score' in choice">
                +{{choice.score}}
              </div>
            </mt-button>
          </div>
        </div>
      </div>
    </mt-popup>
    <mt-popup class="score-board"
              v-model="scoreBoardVisible"
              popup-transition="popup-fade"
              :closeOnClickModal="false">
      <section id="ranking"><span id="ranking_title">排行榜</span>
        <section id="ranking_list">
          <section class="box" v-for="(user, index) in scoreTable">
            <section class="col_1" :title="index+1">{{index + 1}}</section>
            <section class="col_2"><img :src="user.avatar"></section>
            <section class="col_3">{{user.username}}</section>
            <section class="col_4">{{user.score}}</section>
          </section>
        </section>
      </section>
    </mt-popup>
  </div>
</template>

<script>
  import {MessageBox} from 'mint-ui';

  export default {
    mounted() {
      this.getUserInfo();
      this.joinRoom();
    },
    destroyed() {
      this.leaveRoom();
    },
    sockets: {
      connect: function () {
      },
      clients: function (data) {
        // all clients information
        this.$socket.emit('isowner', {room: this.roomId});
        this.clients = data;
        this.setEmptyUsers();
      },
      isowner: function (data) {
        // room owner
        this.isOwner = data;
      },
      msg: function (data) {
        this.contents.push(data);
        this.refreshMsgBox()
      },
      gamestate: function (data) {
        this.isGameStart = data['isPlaying'];
        this.gameBoardVisible = false;
        this.chosen = "";
        if (this.isGameStart) {
          //update question board
          let question = `第${data['round']}轮：${data['question']}`;
          this.contents.push(question);
          this.refreshMsgBox();
          this.question = data['question'];
          this.choices = [];
          for (let c of data['choices'].split("|")) {
            this.choices.push({text: c, type: 'default'});
          }
          this.gameBoardVisible = true;
          //update timer
          this.time = 10;
          clearInterval(this.timer);
          this.timer = setInterval(() => {
            this.time -= 1;
            if (this.time <= 0) {
              clearInterval(this.timer);
            }
          }, 1000)
        } else {
          //update score table
          this.scoreTable = data['scoreTable'];
          this.scoreBoardVisible = true;
          setTimeout(() => {
            this.scoreBoardVisible = false;
          }, 5000)
        }
      },
      answer: function (data) {
        // update answer color and score
        if (data['correct']) {
          for (let c of this.choices) {
            if (c['text'] === data['answer']) {
              c['type'] = 'primary';
              c['score'] = data['score'];
              break;
            }
          }
        } else {
          for (let c of this.choices) {
            if (c['text'] === data['answer']) {
              c['type'] = 'primary';
            } else if (c['text'] === this.chosen) {
              c['type'] = 'danger';
            }
          }
        }
      },
      alert: function (data) {
        MessageBox.alert(data['msg']);
      }
    },
    data() {
      return {
        userInfo: {
          username: '',
          avatar: ''
        },
        msg: '',
        roomId: this.$route.params.roomId,
        clients: [],
        isOwner: false,
        isGameStart: false,
        isReady: false,
        contents: [],
        gameBoardVisible: false,
        question: "",
        choices: [],
        chosen: "",
        time: 10,
        timer: null,
        scoreBoardVisible: false,
        scoreTable: []
      }
    },
    methods: {
      joinRoom() {
        let data = {};
        data['room'] = this.roomId;
        data['username'] = this.userInfo.username;
        data['avatar'] = this.userInfo.avatar;
        this.$socket.emit('joinroom', data);
      },
      leaveRoom() {
        this.$socket.emit('leaveroom');
      },
      setEmptyUsers() {
        let emptyUser = {username: '空位', owner: false, avatar: 'http://placekitten.com/g/263/263'};
        for (let i = this.clients.length; i < 8; i++) {
          this.clients.push(emptyUser);
        }
      },
      startGame() {
        this.$socket.emit('startgame', {room: this.roomId});
      },
      readyGame() {
        this.isReady = !this.isReady;
        this.$socket.emit('ready', {room: this.roomId, ready: this.isReady});
      },
      sendMsg() {
        let msg = {
          msg: this.msg,
          room: this.roomId,
          username: this.userInfo.username
        };
        this.$socket.emit('sendmsg', msg);
        this.msg = '';
      },
      refreshMsgBox() {
        this.$nextTick(function () {
          let div = document.getElementById('msg-box');
          div.scrollTop = div.scrollHeight;
        });
      },
      onAnswer(answer, index) {
        if (!this.chosen) {
          this.$socket.emit('answer', {answer: answer, room: this.roomId});
          this.chosen = answer;
        }
      },
      getUserInfo() {
        this.userInfo = this.$store.getters.userInfo;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .user-card-set {
    border-radius: 4px;
    border: 1px solid #ebeef5;
    padding: 3%;
  }

  .user-card-set .user-card {
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    background-color: #fff;
    overflow: hidden;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    color: #303133;
    width: 20%;
    margin: 0 2%;
  }

  .user-card-set .user-card .user-card-badge {
    position: absolute;
  }

  .user-card-set .user-card img {
    width: 100%;
    height: 100%;
  }

  .game-button-div {
    margin-top: 2%;
  }

  .game {
    position: absolute;
    bottom: 1%;
    right: 1%;
    left: 1%;
  }

  .game .msg-send {

  }

  .game .msg-send .msg-send-form {
    position: relative;
    line-height: normal;
    display: inline-table;
    width: 100%;
    border-collapse: separate;
    bottom: 0;
  }

  .game .msg-box {
    height: 250px;
    width: -webkit-fill-available;;
    overflow-y: auto;
    word-wrap: break-word;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    margin: 5px 0;
    bottom: 40px;
    top: 260px;
  }

  .game .msg-send .msg-send-form input {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 1;
    outline: none;
    padding: 0 15px;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    width: 100%;
    margin-right: 5px;
  }

  .game .msg-send .msg-send-form .msg-send-button {
    vertical-align: middle;
    display: table-cell;
    position: relative;
    white-space: nowrap;
    padding-left: 1%;
  }

  .game .msg-send .msg-send-form .msg-send-button button {
    width: 100%;
    height: 40px;
  }

  .question-board {
    border-radius: 4px;
    border: 1px solid #ebeef5;
    padding: 8%;
    margin: 5px;
    width: 50%;
    background: rgba(0, 0, 0, 0.7);
  }

  .question-board .question-time {
    color: #fff;
    text-align: center;
    font-size: 30px;
  }

  .question-board .question-title {
    color: #fff;
    font-weight: 300;
    font-size: 20px;
    word-wrap: break-word;
  }

  .question-board .question-answer-cell {
    margin: 10px 0;
  }

  .question-board .question-answer-cell .question-text {
    font-size: 16px;
  }

  .question-board .question-answer-cell .question-score {
    position: relative;
    float: right;
  }

  #ranking {
    display: block;
    border: 1px #7A99D9 solid;
    background-color: #fff;
    padding: 30px 15px;
  }

  #ranking_list {
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  #ranking_list::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #F5F5F5;
    border-radius: 10px;
  }

  #ranking_list::-webkit-scrollbar {
    width: 5px;
    background-color: #F5F5F5;
  }

  #ranking_list::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-image: -webkit-gradient(linear, left bottom, left top, color-stop(0.44, rgb(122, 153, 217)), color-stop(0.72, rgb(73, 125, 189)), color-stop(0.86, rgb(28, 58, 148)));
  }

  #ranking_title {
    display: block;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #fff;
    font-size: 18px;
    border-radius: 20px;
    position: absolute;
  }

  #ranking_title {
    width: 50%;
    left: 25%;
    top: -21px;
    background-color: #497DBD;
  }

  .box {
    width: 200px;
    background-color: #fffaef;
    height: 50px;
    line-height: 50px;
    display: -webkit-box;
    display: -moz-box;
    display: box;
    border-radius: 10px;
    margin: 5px auto 5px;
  }

  .cur {
    background-color: #91cad6;
  }

  .col_1 {
    width: 50px;
    text-align: center;
    font-size: 20px;
    color: #497DBD;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 40px 40px;
  }

  .col_1[title="1"] {
    color: #fff;
    background-image: url(../assets/r1.png);
    line-height: 38px;
  }

  .col_1[title="2"] {
    color: #fff;
    background-image: url(../assets/r2.png);
    line-height: 38px;
  }

  .col_1[title="3"] {
    color: #fff;
    background-image: url(../assets/r3.png);
    line-height: 38px;
  }

  .col_2 {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    box-flex: 1;
    display: inline-block;
    padding: 5px 0;
    text-align: center;
    margin-right: 5px;
  }

  .col_2 img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .col_3 {
    width: 35%;
    color: #4486cb;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    text-align: left;
  }

  .col_4 {
    width: 25%;
    text-align: center;
    color: #59bcec;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
