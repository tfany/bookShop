'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //BASE_API: '"http://101.201.239.223:8090"'
  BASE_API: '"http://localhost:8090"'
})
