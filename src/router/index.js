import Vue from 'vue'
import Router from 'vue-router'
import Lobby from '@/components/Lobby'
import Room from '@/components/Room'
import UserInput from '@/components/UserInput'

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
