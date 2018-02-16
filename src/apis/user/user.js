import axios from 'axios'

export function getMonkUser() {
  return axios.get('https://randomuser.me/api/');
}
