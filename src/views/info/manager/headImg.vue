<template>
  <el-card class="form-container" shadow="never">
    <div style="margin-top: 50px">
      <el-form :model="value"
               ref="productRelationForm"
               label-width="120px"
               style="width: 680px"
               size="small">
        <p> 旧头像： <img :src="value.icon" class="avatar"></p>
        <br/>
        <br/>
        <p> 请选择头像</p>
        <el-upload
          class="upload-poster"
          list-type="picture-card"
          :action="url"
          :show-file-list="false"
          :on-change="imgPreview"
          :auto-upload="true"
          :on-success="success"
        >
          <img v-if="ImageUrl" :src="ImageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-form-item style="text-align: center">
          <el-button type="primary" size="medium" @click="handleFinishCommit">修改头像</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>
<script>
  import {getInfo} from '@/api/login'
  import {updateImg} from '@/api/user'

  export default {
    name: "ProductRelationDetail",
    data() {
      return {
        ImageUrl: '',
        value: {}
      };
    },
    created() {
      this.getUserInfo();
    },
    computed: {
      url: {
        get: function () {
          return 'http://101.201.239.223:8090/manager/upload/'+this.value.id;
        },
        set: function () {

        }
      }
    },
    methods: {
      imgPreview(file) {
        let fileName = file.name;
        let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/;
        if (regex.test(fileName.toLowerCase())) {
          this.ImageUrl = file.url;
        } else {
          this.$message.error('请选择图片文件');
        }
      },
      success(response) {
        if (response.code === 200) {
          this.$message({
            message: '封面头像成功',
            type: 'success'
          });
          if (response.data != null) {
            this.value.img = response.data;
          }
        } else {
          this.$message({
            message: '网络不太好，请重新上传',
            type: 'error'
          });
        }
      },
      getUserInfo() {
        getInfo().then(response => {
          this.value = response.data;
        })
      },


      handlePrev() {
        this.$emit('prevStep')
      },
      handleFinishCommit() {
        this.$confirm('确认修改吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let manager = {};
          manager.headImg=this.value.img
          updateImg(manager).then(response => {
            this.$alert("修改成功", {
              type: 'success'
            });
            this.$router.push("/info/index");
          });
        })
      },
    }
  }
</script>

<style scoped>
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
