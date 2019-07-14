<template>
  <div style="margin-top: 50px">
    <el-form :model="value"
             ref="productRelationForm"
             label-width="120px"
             style="width: 680px"
             size="small">
     <p>  原头像： <img :src="value.headImg" class="avatar"> </p>
    <br />
    <br />
      <p v-if="isEdit">新头像：</p>
      <p v-else > 请选择头像</p>
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
        <el-button size="medium" @click="handlePrev">上一步，填写基本</el-button>
        <el-button type="primary" size="medium" @click="handleFinishCommit">完成，提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

  export default {
    name: "UserRelationDetail",
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        ImageUrl: '',
      };
    },
    computed:{
      url: {
        get: function () {
          return 'http://101.201.239.223:8090/user/upload/' + this.value.userId;
        },
        set: function () {

        }
      }
    },
    methods: {
      imgPreview (file) {
        let fileName = file.name;
        let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/;
        if (regex.test(fileName.toLowerCase())) {
          this.ImageUrl = file.url;
        } else {
          this.$message.error('请选择图片文件');
        }
      },
      success (response){
        if(response.code===200) {
          this.$message({
            message: '头像上传成功',
            type: 'success'
          });
          if(response.data!=null){
            this.value.headImg=response.data;
          }
        }else{
          this.$message({
            message: '网络不太好，请重新上传',
            type: 'error'
          });
        }
      },


      handlePrev(){
        this.$emit('prevStep')
      },
      handleFinishCommit(){
        this.$emit('finishCommit',this.isEdit);
      }
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
