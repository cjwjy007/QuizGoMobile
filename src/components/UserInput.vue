<template>
  <div>
    <mt-header title="请登陆"></mt-header>
    <div class="user-card">
      <div class="user-detail">
        <div class="user_photo horizontal_center" id="user_photo">
          <img :src="userInfo.avatar"></div>
      </div>
      <mt-field label="用户名" placeholder="请输入用户名" v-model="userInfo.username"></mt-field>
      <div class='login-button'>
        <mt-button type="primary" size="large" @click="login">确认登录</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {namelist} from '@/assets/namelist'

  export default {
    mounted() {
      this.getMockUser();
    },
    data() {
      return {
        userInfo: {
          username: '',
          avatar: 'http://placekitten.com/g/'
        }
      }
    },
    methods: {
      getMockUser() {
        let id = Math.ceil(Math.random() * 100 + 150);
        this.userInfo.username = namelist[Math.ceil(Math.random() * 1500)];
        this.userInfo.avatar += `${id}/${id}`;
      },
      login() {
        this.$store.dispatch('commitLogin', this.userInfo);
        this.$router.go(-1);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .user-card {
    position: relative;
    padding: 20px 0;
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

  .login-button {
    margin: 3%;
  }
</style>
