<template>
  <div class="app-container">
    <!--头部-->
    <div class="header">
      <div class="topbar">
        <div class="wrap">
          <div class="topbar-right" v-if="!user">
            <router-link :to="{path: 'customer/login'}" id="login">登录 |</router-link>
            <router-link :to="{path: 'customer/register'}" id="register"> 注册</router-link>
          </div>
          <div class="topbar-right" v-else>
            <a @click="handleUser">修改个人信息 | </a>
            <router-link :to="{path: 'customer/history'}"> 历史订单 |</router-link>
            <a @click="logout">退出</a>

          </div>
        </div>
      </div>
      <div class="nav wrap">
        <div class="nav-logo">
          <router-link :to="{path: 'customer'}"><img :src="logo" alt=""></router-link>
        </div>
        <div class="header-nav">
          <ul class="nav-list">
            <li class="nav-category" id="nav-all" onmouseover="navallOver()" onmouseout="navallOut()">
              <a @click="showAll">全部商品</a>
            </li>
            <li class="nav-item" id="phone">
              <a>书籍推荐</a>
              <div class="nav-bar-down" id="navbar1">
                <div class="wrap">
                  <div v-for="v in value.length>=5?5:value.length">
                    <div @click="showDetail(value[v-1].bookId)">
                      <img v-if="value[v-1].img" :src="value[v-1].img">
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <label>
          <el-input v-model="input" placeholder="请输入书籍名称或作者" style="width: 30ex; margin-top: 30px;"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="handSearch(input)">搜索</el-button>
        </label>
      </div>
    </div>
    <div class="clear"></div>
    <!--主体-->
    <div class="main">
      <!--导航栏-->
      <div class="home-hero-container wrap">
        <el-carousel :interval="3000" type="card" height="460px">
          <el-carousel-item v-for="v in value.length>=5?5:value.length" :key="v">
            <div @click="showDetail(value[v-1].bookId)">
              <img v-if="value[v-1].img" :src="value[v-1].img" width="auto" height="460px">
            </div>
          </el-carousel-item>
        </el-carousel>

        <div class="home-category">
          <ul>
            <li class="nav-hover" v-for="o in options">
              <a @click="showNoParent(o.value)">{{o.label}} <i class="iconfont">&#xe602;</i>
              </a>
              <div class="category-children">
                <ul class="children-list">
                  <li v-for="c in o.children">
                    <a @click="showByParent(c.value) ">{{c.label}}</a>
                    <img :src="c.image" alt=""/>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="clear"></div>
    </div>
    <div class="main-page">
      <div class="wrap">
        <div class="phone">
          <div class="title">
            <h2>书籍</h2>
            <el-button @click="showAll" class="showAll">查看全部</el-button>
          </div>
          <div class="clear"></div>
          <div class="content">
            <div class="phone-8">
              <ul>
                <li v-for="v in value">
                  <div>
                    <img v-if="v.img" :src="v.img" height="220" width="220" alt=""/>
                    <h3>{{v.bookName}}</h3>
                    <p class="desc">作者:{{v.author}}</p>
                    <label class="price">{{v.price}}元</label>
                    <el-button class="detail" size="small" @click="showDetail(v.bookId)"> 查看详情</el-button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div style="height: 40px;"></div>
    </div>

    <!--底部-->
    <div class="clear"></div>
    <div class="footer">
      <div class="wrap">
        <div class="footer-links">
          <dl>
            <dt>帮助中心</dt>
            <dd>账户管理</dd>
            <dd>购物指南</dd>
            <dd>订单操作</dd>
          </dl>
          <dl>
            <dt>服务支持</dt>
            <dd>售后政策</dd>
            <dd>自助服务</dd>
            <dd>相关下载</dd>
          </dl>
          <dl>
            <dt>线下门店</dt>
            <dd>糖糖之家</dd>
            <dd>服务网点</dd>
            <dd>零售网点</dd>
          </dl>
          <dl>
            <dt>关于糖糖</dt>
            <dd>了解糖糖</dd>
            <dd>加入糖糖</dd>
            <dd>联系我们</dd>
          </dl>
          <dl>
            <dt>关注我们</dt>
            <dd>新浪微博</dd>
            <dd>糖糖部落</dd>
            <dd>官方微信</dd>
          </dl>
          <div class="footer-contact">
            <p class="phone">13992543350</p>
            <p>周一至周日 8:00-18:00<br>（仅收市话费）</p>
            <a class="footer-btn"> 在线客服</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {fetchListWithChildren} from '@/api/productCate'
  import {getUserInfo as userInfo} from '@/api/user'
  import {fetchList, getBookNoParent, getBookByParent, fetchSimpleList} from '@/api/product'
  import logo from '@/assets/images/logo.jpg';

  export default {
    name: "headerIndex",
    data() {
      return {
        value: [],
        options: [],
        user: {},
        input: '',
        activeIndex: '1',
        activeIndex2: '1',
        logo
      }
    },
    created() {
      this.getProductCateList();
      this.getList();
      this.getUserInfo();
    },
    methods: {
      getProductCateList() {
        fetchListWithChildren().then(response => {
          let list = response.data;
          this.options = [];
          for (let i = 0; i < list.length; i++) {
            let children = [];
            if (list[i].children != null && list[i].children.length > 0) {
              for (let j = 0; j < list[i].children.length; j++) {
                children.push({
                  label: list[i].children[j].categoryName,
                  value: list[i].children[j].categoryId,
                  image: list[i].children[j].categoryImg
                });
              }
            }
            this.options.push({label: list[i].categoryName, value: list[i].categoryId, children: children});
          }
        });
      },
      getList() {
        this.listLoading = true;
        fetchList({pageNum: 1, pageSize: 10}).then(response => {
          this.listLoading = false;
          this.value = response.data.list;
          this.total = response.data.total;
        });
      },
      showAll() {
        fetchList({pageNum: 1, pageSize: 10000}).then(response => {
          this.listLoading = false;
          this.value = response.data.list;
          this.total = response.data.total;
        });
      },
      showNoParent(id) {
        getBookNoParent(id).then(response => {
          this.value = response.data;
        })
      },
      showByParent(id) {
        getBookByParent(id).then(response => {
          this.value = response.data;
        })
      },
      showDetail(id) {
        this.$router.push({path: "customer/detailPage", query: {id: id}});
      },
      handSearch(keyWord) {
        let k = {};
        k.keyWord = keyWord;
        fetchSimpleList(k).then(response => {
          this.value = response.data;
        })
      },
      getUserInfo() {
        userInfo().then(response => {
          this.user = response.data
        }).catch(e => {
          this.user = null
        })
      },
      handleUser() {
        this.$router.push({path: '/customer/updateUser', query: {id: this.user.userId}});
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      }
    }
  }
</script>

<style scoped>
  .showAll {
    float: right;
    margin-right: 80px;
  }


  .op span {
    color: #ffffff
  }

  .detail {
    float: right;
    margin-right: 10px;
  }

  .item {
    padding: 18px 0;
  }


</style>
