import request from '@/utils/request'

export function login(managerId, password) {
  return request({
    url: '/manager/verifylogin',
    method: 'post',
    data: {
      managerId,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/manager/userinfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/manager/logout',
    method: 'post'
  })
}
