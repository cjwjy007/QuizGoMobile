<template>
  <div>
    <mt-header title="大厅"></mt-header>
    <div class="page-body">
      <div class="user-card">
        <div class="user-detail">
          <div class="user_photo horizontal_center" id="user_photo">
            <img :src="userInfo.avatar"></div>
        </div>
        <mt-field :disableClear="true" :readonly="true" label="欢迎！" v-model="userInfo.username">
          <mt-button size="small" @click="cleanCache">退出登录</mt-button>
        </mt-field>
      </div>
      <div style="margin-top: 5%">
        <mt-button type="primary" size="large" @click="createRoom">创建房间</mt-button>
      </div>
      <div class="lobby-bottom">
        Tip：请大家及时将不完整的、错误的、过时的题目截图发给Gerald，谢谢大家。
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    mounted() {
      this.getUserInfo();
    },
    sockets: {
      connect: function () {
        console.log('socket connected')
      },
      createroom: function (data) {
        this.$router.push({name: 'Room', params: {roomId: data.room}});
      }
    },
    data() {
      return {
        userInfo: {
          username: '',
          avatar: ''
        }
      }
    },
    methods: {
      createRoom() {
        this.$socket.emit('createroom');
      },
      getUserInfo() {
        this.userInfo = this.$store.getters.userInfo;
      },
      cleanCache() {
        this.$store.dispatch('commitLogout');
        this.$router.push({name: 'UserInput'})
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .user-card {
    position: relative;
    padding-top: 20px;
    width: 100%;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 0 1px rgba(0, 0, 0, .5);
    overflow: hidden;
    text-align: center;
    z-index: 5;
  }

  .user-card .user_photo {
    position: relative;
    margin: 0 auto;
    background: #fff;
    padding: 5px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin-bottom: 30px;
    border: 1px solid rgba(0, 0, 0, .25);
  }

  .user-card .user_photo img {
    width: 150px;
    border-radius: 50%;
  }

  .user-card:after {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 130px;
    top: 0;
    background: #f9f9f9;
    border-bottom: 1px solid rgba(0, 0, 0, .15);
    z-index: -1;
  }

  .lobby-bottom{
    margin-top: 20px;
    text-align: center;
    color: #9e9e9ea8;
  }
</style>
