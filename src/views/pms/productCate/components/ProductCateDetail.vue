<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="productCate"
             :rules="rules"
             ref="productCateFrom"
             label-width="150px">
      <el-form-item label="分类名称：" prop="categoryName">
        <el-input v-model="productCate.categoryName"></el-input>
      </el-form-item>
      <el-form-item label="上级分类：">
        <el-select v-model="productCate.parentId"
                   placeholder="请选择分类">
          <el-option
            v-for="item in selectProductCateList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类图标：">
        <el-upload
          class="upload-poster"
          list-type="picture-card"
          :action="url"
          :show-file-list="false"
          :on-change="imgPreview"
          :auto-upload="true"
          :on-success="success"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <br />
      <el-form-item label="分类描述：">
        <el-input type="textarea" :autosize="true" v-model="productCate.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('productCateFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('productCateFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import {fetchList, createProductCate, updateProductCate, getProductCate} from '@/api/productCate';

  const defaultProductCate = {
    description: '',
    categoryImg: '',
    categoryName: '',
    parentId: '',
    categoryId: '',
  };
  export default {
    name: "ProductCateDetail",
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        productCate: Object.assign({}, defaultProductCate),
        selectProductCateList: [],
        imgUrl: '',
        rules: {
          categoryName: [
            {required: true, message: '请输入分类名称', trigger: 'blur'},
            {min: 1, max: 140, message: '长度在 1 到 140 个字符', trigger: 'blur'}
          ]
        },
      }
    },
    computed:{
      url: {
        get: function () {
          if(this.isEdit)
            return 'http://101.201.239.223:8090/category/upload/' +this.$route.query.id;
          return 'http://101.201.239.223:8090/category/upload/-1'
        },
        set: function () {

        }
      },
    },
    created() {
      if (this.isEdit) {
        getProductCate(this.$route.query.id).then(response => {
          this.productCate = response.data;
          this.imgUrl=response.data.categoryImg;
        });
      } else {
        this.productCate = Object.assign({}, defaultProductCate);
      }
      this.getSelectProductCateList();
    },
    methods: {
      getSelectProductCateList() {
        fetchList(0, {pageSize: 100, pageNum: 1}).then(response => {
          this.selectProductCateList = response.data.list;
          this.selectProductCateList.unshift({id: null, name: '无上级分类'});
        });
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                updateProductCate(this.$route.query.id, this.productCate).then(response => {
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                  });
                  this.productCate.imgUrl= '';
                  this.$router.back();
                });
              } else {
                createProductCate(this.productCate).then(response => {
                  this.$refs[formName].resetFields();
                  this.resetForm(formName);
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration: 1000
                  });
                  this.productCate.imgUrl= '';

                });
              }
            });

          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.productCate = Object.assign({}, defaultProductCate);
        this.getSelectProductCateList();
      },
      imgPreview (file) {
        let fileName = file.name;
        let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/;
        if (regex.test(fileName.toLowerCase())) {
          this.imgUrl = file.url;
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
            this.productCate.categoryImg=response.data;
          }
        }else{
          this.$message({
            message: '网络不太好，请重新上传',
            type: 'error'
          });
        }
      },

    },
  }
</script>

<style scoped>
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
