import fetch from '../interceptors'

export function createRoom(data) {
  return fetch({
    url: '/room/createroom',
    method: 'get',
    params: data
  });
}

