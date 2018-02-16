import LocalStorage from '../../util/localstorage'

const state = {
  username: '',
  avatar: ''
};

// getters
const getters = {
  userInfo:function(state){
    return {
      username: state.username,
      avatar: state.avatar
    }
  }
};

// actions
const actions = {
  commitLogin(store, userInfo) {
    LocalStorage.setObject('userInfo', userInfo);
    store.commit('LOGIN', userInfo);
  },
  commitLogout(store) {
    LocalStorage.removeObject('userInfo');
    store.commit('LOGOUT');
  },
  cookieLogin(store) {
    let userInfo = LocalStorage.getObject('userInfo');
    if (userInfo) {
      store.commit('LOGIN', userInfo);
    }
  }
};

// mutations
const mutations = {
  LOGIN(state, action) {
    state.username = action.username;
    state.avatar = action.avatar;
  },
  LOGOUT(state) {
    state.username = '';
    state.avatar = '';
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
