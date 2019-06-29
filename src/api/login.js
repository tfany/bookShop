import request from '@/utils/request'

export function login(userId, password) {
  return request({
    url: '/user/verifylogin',
    method: 'post',
    data: {
      userId,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/user/userinfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
