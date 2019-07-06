<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="brand" :rules="rules" ref="brandFrom" label-width="150px">
      <el-form-item label="供应商名称：" prop="supplierName">
        <el-input v-model="brand.supplierName"></el-input>
      </el-form-item>
      <el-form-item label="供应商联系方式：" prop="phoneNum">
        <el-input v-model="brand.phoneNum"></el-input>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="onSubmit('brandFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('brandFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createBrand, getBrand, updateBrand} from '@/api/brand'
  import {validPhone} from '@/utils/validate';

  const defaultBrand={
    supplierId: '',
    supplierName: '',
    phoneNum: ''
  };
  export default {
    name: 'BrandDetail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },

    data() {
      const validatePhoneNum = (rule, value, callback) => {
        if (!validPhone(value)) {
          callback(new Error('请输入正确的手机号码'))
        } else {
          callback()
        }
      };
      return {
        brand:Object.assign({}, defaultBrand),
        rules: {
          supplierName: [
            {required: true, message: '请输入供应商名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          phoneNum: [
            {validator: validatePhoneNum, message: '请输入正确的手机号码'},
          ],
        }
      }
    },
    created() {
      if (this.isEdit) {
        getBrand(this.$route.query.id).then(response => {
          this.brand = response.data;
        });
      }else{
        this.brand = Object.assign({},defaultBrand);
      }
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                updateBrand(this.$route.query.id, this.brand).then(response => {
                  this.$refs[formName].resetFields();
                  this.$alert("修改成功",{
                    type: 'success'
                  });
                  this.$router.back();
                });
              } else {
                createBrand(this.brand).then(response => {
                  this.$refs[formName].resetFields();
                  this.brand = Object.assign({},defaultBrand);
                  this.$alert("添加成功",{
                    type: 'success'
                  });
                });
              }
            });

          } else {
            this.$alert("操作失败",{
              type: 'error'
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.brand = Object.assign({},defaultBrand);
      }
    }
  }
</script>
<style>
</style>


