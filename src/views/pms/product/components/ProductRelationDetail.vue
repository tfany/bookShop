<template>
  <div style="margin-top: 50px">
    <el-form :model="value"
             ref="productRelationForm"
             label-width="120px"
             style="width: 680px"
             size="small">
     <p v-if="isEdit">  旧封面： <img :src="value.img" class="avatar"> </p>
    <br />
    <br />
      <p v-if="isEdit">新封面：</p>
      <p v-else > 请选择封面</p>
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
        <el-button size="medium" @click="handlePrev">上一步，填写图书属性</el-button>
        <el-button type="primary" size="medium" @click="handleFinishCommit">完成，提交图书</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

  export default {
    name: "ProductRelationDetail",
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
          return 'http://localhost:8080/library/book/upload/' + this.value.bookId;
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
            message: '封面上传成功',
            type: 'success'
          });
          if(response.data!=null){
            this.value.img=response.data;
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
        this.url=''
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
