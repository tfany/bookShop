import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/rank/list',
    method:'get',
    params:params
  })
}
export function createBrand(data) {
  return request({
    url:'/rank/create',
    method:'post',
    data:data
  })
}
export function updateShowStatus(data) {
  return request({
    url:'/rank/update/showStatus',
    method:'post',
    data:data
  })
}

export function updateFactoryStatus(data) {
  return request({
    url:'/rank/update/factoryStatus',
    method:'post',
    data:data
  })
}

export function deleteBrand(id) {
  return request({
    url:'/rank/delete/'+id,
    method:'get',
  })
}

export function getBrand(id) {
  return request({
    url:'/rank/'+id,
    method:'get',
  })
}

export function updateBrand(id,data) {
  return request({
    url:'/rank/update/'+id,
    method:'post',
    data:data
  })
}

