<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="rank" :rules="rules" ref="rankFrom" label-width="150px">
      <el-form-item label="会员等级：" prop="level">
        <el-input v-model.number="rank.level" :disabled="this.isEdit"></el-input>
      </el-form-item>
      <el-form-item label="等级名称：" prop="name">
        <el-input v-model="rank.name"></el-input>
      </el-form-item>
      <el-form-item label="折扣率：" prop="discount">
        <el-input v-model="rank.discount"></el-input>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="onSubmit('rankFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('rankFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createBrand, getBrand, updateBrand} from '@/api/rank'
  import {validDiscount} from '@/utils/validate';

  const defaultRank={
    level: '',
    name: '',
    discount: ''
  };
  export default {
    name: 'RankDetail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },

    data() {
      const validateDiscount = (rule, value, callback) => {
        if (!validDiscount(value)) {
          callback(new Error('请输入正确的折扣'))
        } else {
          callback()
        }
      };
      return {
        rank:Object.assign({}, defaultRank),
        rules: {
          name: [
            {required: true, message: '请输入等级名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ],
          discount: [
            {required: true,validator: validateDiscount, message: '请输入正确的折扣'},
          ],
          level: [
            {required: true,message: '请输入等级编号'},
            {type: 'number'}
          ]
        }
      }
    },
    created() {
      if (this.isEdit) {
        getBrand(this.$route.query.id).then(response => {
          this.rank = response.data;
        });
      }else{
        this.rank = Object.assign({},defaultRank);
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
                updateBrand(this.$route.query.id, this.rank).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    showClose: true,
                    message: '修改成功',
                    type: 'success'
                  });
                  this.$router.back();
                });
              } else {
                createBrand(this.rank).then(response => {
                  this.$refs[formName].resetFields();
                  this.rank = Object.assign({},defaultRank);
                  this.$message({
                    showClose: true,
                    message: '添加成功',
                    type: 'success'
                  });
                  this.$router.push("/ums/rank");
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
        this.rank = Object.assign({},defaultRank);
      }
    }
  }
</script>
<style>
</style>


