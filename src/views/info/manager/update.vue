<template>
  <el-card class="form-container" shadow="never">
    <div style="margin-top: 50px">
      <el-form :model="value" :rules="rules" ref="userInfoForm" label-width="120px" style="width: 600px" size="small">
        <el-form-item label="姓名：" prop="username">
          <el-input v-model="value.username"></el-input>
        </el-form-item>

        <el-form-item label="密码：" prop="password">
          <el-input name="password"
                    :type="pwdType"
                    v-model="value.password"
                    autoComplete="on"
                    placeholder="请输入密码"
          >
          <span slot="suffix" @click="showPwd">
            <svg-icon icon-class="eye" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" size="medium" @click="handleFinishCommit">完成，提交</el-button>
        </el-form-item>
      </el-form>

    </div>
  </el-card>
</template>

<script>
  import {getInfo} from '@/api/login'
  import {update} from '@/api/user'

  export default {
    name: "infoDetail",
    data() {
      return {
        hasEditCreated: false,
        value: {},
        pwdType: 'password',
        rules: {
          username: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
            {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}
          ],
          password: [{required: true, message: '请输入密码', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}]
        }
      };
    },
    created() {
      this.getUserInfo();
    },
    methods: {
      //处理编辑逻辑
      handleEditCreated() {
        this.hasEditCreated = true;
      },
      getUserInfo() {
        getInfo().then(response => {
          this.value = response.data;
        })
      },
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      handleFinishCommit() {
        this.$confirm('确认修改吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let manager={};
          manager.managerName=this.value.username;
          manager.password=this.value.password;
          manager.headImg=this.value.icon;
          console.log(manager)
          update(manager).then(response => {
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
</style>
