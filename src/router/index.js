import Vue from 'vue'
import Router from 'vue-router'
import Lobby from '../components/Lobby.vue'
import Room from '../components/Room.vue'
import UserInput from '../components/UserInput.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Lobby',
      component: Lobby
    },
    {
      path: '/room/:roomId',
      name: 'Room',
      component: Room
    },
    {
      path: '/userinput',
      name: 'UserInput',
      component: UserInput
    }
  ]
})
