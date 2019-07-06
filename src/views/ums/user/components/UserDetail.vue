<template> 
  <el-card class="form-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="修改基本信息"></el-step>
      <el-step title="修改头像"></el-step>
    </el-steps>
    <user-info-detail
      v-show="showStatus[0]"
      v-model="productParam"
      :is-edit="isEdit"
      @nextStep="nextStep">
    </user-info-detail>
    <user-relation-detail
      v-show="showStatus[1]"
      v-model="productParam"
      :is-edit="isEdit"
      @prevStep="prevStep"
      @finishCommit="finishCommit">
    </user-relation-detail>
  </el-card>
</template>
<script>
  import UserInfoDetail from './UserInfoDetail';
  import UserRelationDetail from './UserRelationDetail';
  import {createProduct,getProduct,updateProduct} from '@/api/user';

  const defaultProductParam = {
    userId: '',
    name: '',
    gender: '',
    password: '',
    phoneNum: '',
    createTime: '',
    updateTime: '',
    status: '',
    headImg: '',
    rank: '',
    level: ''
  };
  export default {
    name: 'UserDetail',
    components: {UserInfoDetail, UserRelationDetail},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        active: 0,
        productParam: Object.assign({}, defaultProductParam),
        showStatus: [true, false,],
      }
    },
    created(){
      if(this.isEdit){
        getProduct(this.$route.query.id).then(response=>{
          this.productParam=response.data;
        });
      }
    },
    methods: {
      hideAll() {
        for (let i = 0; i < this.showStatus.length; i++) {
          this.showStatus[i] = false;
        }
      },
      prevStep() {
        if (this.active > 0 && this.active < this.showStatus.length) {
          this.active--;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
      nextStep() {
        if (this.active < this.showStatus.length - 1) {
          this.active++;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
      finishCommit() {
        this.$confirm('是否要提交该产品', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            updateProduct(this.$route.query.id,this.productParam).then(response=>{
              this.$alert("提交成功",{
                type: 'success'
              });
              this.$router.back();
            });
        })
      }
    }
  }
</script>
<style>
  .form-container {
    width: 800px;
  }
</style>


