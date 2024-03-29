import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/supplier/list',
    method:'get',
    params:params
  })
}
export function createBrand(data) {
  return request({
    url:'/supplier/create',
    method:'post',
    data:data
  })
}
export function updateShowStatus(data) {
  return request({
    url:'/supplier/update/showStatus',
    method:'post',
    data:data
  })
}

export function updateFactoryStatus(data) {
  return request({
    url:'/supplier/update/factoryStatus',
    method:'post',
    data:data
  })
}

export function deleteBrand(id) {
  return request({
    url:'/supplier/delete/'+id,
    method:'get',
  })
}

export function getBrand(id) {
  return request({
    url:'/supplier/'+id,
    method:'get',
  })
}

export function updateBrand(id,data) {
  return request({
    url:'/supplier/update/'+id,
    method:'post',
    data:data
  })
}

