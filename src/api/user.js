import request from '@/utils/request'
import axios from 'axios'

export function fetchList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params: params
  })
}

export function fetchSimpleList(params) {
  return request({
    url: '/user/simpleList',
    method: 'get',
    params: params
  })
}

export function updateDeleteStatus(params) {
  return request({
    url: '/user/update/deleteStatus',
    method: 'post',
    params: params
  })
}

export function updateNewStatus(params) {
  return request({
    url: '/user/update/newStatus',
    method: 'post',
    params: params
  })
}

export function updateRecommendStatus(params) {
  return request({
    url: '/user/update/recommendStatus',
    method: 'post',
    params: params
  })
}

export function updatePublishStatus(params) {
  return request({
    url: '/user/update/publishStatus',
    method: 'post',
    params: params
  })
}

export function createProduct(data) {
  return request({
    url: '/user/create',
    method: 'post',
    data: data
  })
}

export function updateProduct(id,data) {
  return request({
    url:'/user/update/'+id,
    method:'post',
    data:data
  })
}

export function getProduct(id) {
  return request({
    url: '/user/updateInfo/' + id,
    method: 'get',
  })
}

