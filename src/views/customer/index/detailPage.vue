<template>
  <el-row>
    <el-col :span="12" :offset="5">
      <el-card align="center">
        <img class="image" v-if="value.img" :src="value.img" :alt="value.bookName"/>
        <h3>{{value.bookName}}</h3>
        <p class="desc">作者:{{value.author}}</p>
        <p class="desc">库存:{{value.stock}}</p>
        <p class="price">售价: {{value.price}}元</p>
        <p class="price">租价: {{value.price/500 | formatPrice}}元 / 天</p>
        <p class="desc" v-if="user">您是{{user.rank.name}},享受{{user.rank.discount*10}}折优惠</p>
        <p><b>注意: 租价为售价的1/500,结算时四舍五入计算</b></p>
        <p class="rent">
          租借天数:
          <el-input-number v-model="day" :min="1" :max="365" label="描述文字"></el-input-number>
        </p>
        <p class="rent">
          租借数量:
          <el-input-number v-model="count" :min="0" :max="value.stock" label="描述文字"></el-input-number>
        </p>
        <p class="rent">
          应付金额:
          {{this.sum}}元
        </p>
        <el-button type="primary" @click="rent">
          租借
        </el-button>
        <el-button type="primary" @click="toIndex">
          返回首页
        </el-button>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  import {getProduct} from '@/api/product'
  import {add} from '@/api/order'
  import {getUserInfo as getInfo} from '@/api/user'


  export default {
    name: "detailPage",
    data() {
      return {
        value: {},
        day: 1,
        count: 0,
        user: null,
      }
    },
    created() {
      this.getBook();
      this.getUserIfo();
    },
    filters: {
      formatPrice(val) {
        return val.toFixed(4);
      }
    },
    computed: {
      sum() {
        let num = this.day * this.count * this.value.price / 500;
        if(this.user){
          num*=this.user.rank.discount;
        }
        return num.toFixed(2);
      }
    },
    methods: {
      getBook() {
        getProduct(this.$route.query.id).then(response => {
          this.value = response.data;
        })
      },
      getUserIfo() {
        getInfo().then(response => {
          this.user = response.data;
        })
      },
      rent() {
        if(this.user==null){
          this.$message({
            type: "error",
            message: "请先登录"
          })
         return;
        }
        if(this.user.status===0){
          this.$message({
            type: "error",
            message: "您以违规,没有权限借书,请联系管理员解封"
          })
          return;
        }
        this.$confirm('确认支付' + this.sum + '元,租借' + this.count + '本' + this.value.bookName + this.day + '天吗?', '提示', {
          confirmButtonText: '支付',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(
          () => {
            let params = {};
            params.bookId = this.value.bookId;
            params.userId = this.user.userId;
            params.rentDay = this.day;
            params.rentCount = this.count;
            params.money = this.sum;
            add(params).then((response) => {
              this.$message({
                type: 'success',
                message: "租借成功"
              })
            });
            this.count=0;
            this.day=1;
            this.getBook();
            this.getBook();
            this.getBook();
            this.getBook();
          }
        ).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消支付'
          });
        });
      },
      toIndex(){
        this.$router.push("/customer")
      },
    }
  }

</script>

<style scoped>
  .image {
    width: 400px;
    height: 400px;
  }

  .rent {
    margin: 10px 0 10px 0;
  }
</style>
