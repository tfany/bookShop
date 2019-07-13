import request from '@/utils/request'
import axios from 'axios'

export function fetchList(params) {
  return request({
    url: '/book/list',
    method: 'get',
    params: params
  })
}

export function fetchSimpleList(params) {
  return request({
    url: '/book/simpleList',
    method: 'get',
    params: params
  })
}

export function updateDeleteStatus(params) {
  return request({
    url: '/book/update/deleteStatus',
    method: 'post',
    params: params
  })
}

export function updateNewStatus(params) {
  return request({
    url: '/book/update/newStatus',
    method: 'post',
    params: params
  })
}

export function updateRecommendStatus(params) {
  return request({
    url: '/book/update/recommendStatus',
    method: 'post',
    params: params
  })
}

export function updatePublishStatus(params) {
  return request({
    url: '/book/update/publishStatus',
    method: 'post',
    params: params
  })
}

export function createProduct(data) {
  return request({
    url: '/book/create',
    method: 'post',
    data: data
  })
}

export function updateProduct(id,data) {
  return request({
    url:'/book/update/'+id,
    method:'post',
    data:data
  })
}

export function getProduct(id) {
  return request({
    url: '/book/updateInfo/' + id,
    method: 'get',
  })
}

export function getBookNoParent(id) {
  return request({
    url: '/book/getNoParent/' + id,
    method: 'get',
  })
}

export function getBookByParent(id) {
  return request({
    url: '/book/getByParent/' + id,
    method: 'get',
  })
}

